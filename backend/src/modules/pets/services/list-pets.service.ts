import {Pet} from '@prisma/client';

import {PetRepository} from '../repositories/pet.repository';

export class ListPetsService {
  constructor(private readonly petRepository = new PetRepository()) {}

  async execute(customerId?: string): Promise<Pet[]> {
    if (!customerId) {
      return this.petRepository.listAll();
    }

    return this.petRepository.listByCustomerId(customerId);
  }
}
