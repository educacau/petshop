import {User} from '@prisma/client';

import {AppError} from '@core/errors/app-error';
import {UserRepository} from '../repositories/user.repository';

export class DeleteUserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.userRepository.delete(id);
  }
}
