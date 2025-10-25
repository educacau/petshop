import {Pet, UserRole} from '@prisma/client';

import {AppError} from '@core/errors/app-error';
import {PetRepository} from '../repositories/pet.repository';

type DeleteParams = {
  id: string;
  requesterId: string;
  role: UserRole;
};

export class DeletePetService {
  constructor(private readonly petRepository = new PetRepository()) {}

  async execute({id, requesterId, role}: DeleteParams): Promise<Pet> {
    const pet = await this.petRepository.findById(id);

    if (!pet) {
      throw new AppError('Pet not found', 404);
    }

    if (role === 'CUSTOMER' && pet.customerId !== requesterId) {
      throw new AppError('You are not allowed to delete this pet', 403);
    }

    return this.petRepository.delete(id);
  }
}
