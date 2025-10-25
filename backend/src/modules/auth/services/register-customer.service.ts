import {UserRole} from '@prisma/client';

import {CreateUserService} from '@modules/users/services/create-user.service';

type Input = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export class RegisterCustomerService {
  constructor(private readonly createUserService = new CreateUserService()) {}

  async execute({name, email, password, phone}: Input) {
    return this.createUserService.execute({
      name,
      email,
      password,
      phone,
      role: UserRole.CUSTOMER
    });
  }
}
