import {UserRepository} from '@modules/users/repositories/user.repository';
import {AppError} from '@core/errors/app-error';
import {comparePassword} from '@shared/utils/password';
import {signToken} from '@shared/utils/jwt';

type Input = {
  email: string;
  password: string;
};

type Output = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export class AuthenticateService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async execute({email, password}: Input): Promise<Output> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const validPassword = await comparePassword(password, user.passwordHash);

    if (!validPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = signToken({sub: user.id, role: user.role});

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}
