import {User, UserRole} from '@prisma/client';

import {UserRepository} from '../repositories/user.repository';

type Input = {
  role?: UserRole;
  skip?: number;
  take?: number;
};

export class ListUsersService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async execute({role, skip, take}: Input): Promise<User[]> {
    return this.userRepository.list({role, skip, take});
  }
}
