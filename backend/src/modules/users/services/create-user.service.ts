import {UserRole, User} from '@prisma/client';

import {AppError} from '@core/errors/app-error';
import {UserRepository} from '../repositories/user.repository';
import {hashPassword} from '@shared/utils/password';

type Input = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
};

export class CreateUserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async execute(data: Input): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError('E-mail already in use', 409);
    }

    const passwordHash = await hashPassword(data.password);

    return this.userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      phone: data.phone,
      role: data.role
    });
  }
}
