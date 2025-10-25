import {User, UserRole} from '@prisma/client';

import {AppError} from '@core/errors/app-error';
import {UserRepository} from '../repositories/user.repository';

type Input = {
  id: string;
  name?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  password?: string;
};

export class UpdateUserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async execute(input: Input): Promise<User> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.userRepository.update(input.id, {
      name: input.name,
      phone: input.phone,
      role: input.role,
      isActive: input.isActive
    });
  }
}
