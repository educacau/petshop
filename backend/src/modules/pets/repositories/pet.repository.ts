import {Pet} from '@prisma/client';

import {prisma} from '@infra/prisma/client';

type CreatePetInput = {
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  medicalNotes?: string;
  customerId: string;
};

export class PetRepository {
  async create(data: CreatePetInput): Promise<Pet> {
    return prisma.pet.create({data});
  }

  async findById(id: string): Promise<Pet | null> {
    return prisma.pet.findUnique({where: {id}});
  }

  async listByCustomerId(customerId: string): Promise<Pet[]> {
    return prisma.pet.findMany({where: {customerId}, orderBy: {name: 'asc'}});
  }

  async listAll(): Promise<Pet[]> {
    return prisma.pet.findMany({orderBy: {name: 'asc'}});
  }

  async update(id: string, data: Partial<CreatePetInput>): Promise<Pet> {
    return prisma.pet.update({where: {id}, data});
  }

  async delete(id: string): Promise<Pet> {
    return prisma.pet.delete({where: {id}});
  }
}
