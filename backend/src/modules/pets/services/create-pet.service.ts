import {Pet} from '@prisma/client';

import {PetRepository} from '../repositories/pet.repository';
import {UserRepository} from '@modules/users/repositories/user.repository';
import {AppError} from '@core/errors/app-error';

type Input = {
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  medicalNotes?: string;
  customerId: string;
};

export class CreatePetService {
  constructor(
    private readonly petRepository = new PetRepository(),
    private readonly userRepository = new UserRepository()
  ) {}

  async execute(data: Input): Promise<Pet> {
    const customer = await this.userRepository.findById(data.customerId);

    if (!customer || customer.role !== 'CUSTOMER') {
      throw new AppError('Invalid customer', 400);
    }

    return this.petRepository.create(data);
  }
}
