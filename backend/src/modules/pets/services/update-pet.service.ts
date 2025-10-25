import {Pet} from '@prisma/client';

import {AppError} from '@core/errors/app-error';
import {PetRepository} from '../repositories/pet.repository';

type Input = {
  id: string;
  data: Partial<{
    name: string;
    species: string;
    breed?: string;
    age?: number;
    weight?: number;
    medicalNotes?: string;
  }>;
};

export class UpdatePetService {
  constructor(private readonly petRepository = new PetRepository()) {}

  async execute({id, data}: Input): Promise<Pet> {
    const pet = await this.petRepository.findById(id);

    if (!pet) {
      throw new AppError('Pet not found', 404);
    }

    return this.petRepository.update(id, data);
  }
}
