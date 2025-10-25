import {Prisma, User, UserRole} from '@prisma/client';

import {prisma} from '@infra/prisma/client';

type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string | null;
  isActive?: boolean;
};

type UpdateUserInput = Partial<Omit<CreateUserInput, 'email' | 'passwordHash'>> & {
  passwordHash?: string;
  isActive?: boolean;
};

export class UserRepository {
  async create(data: CreateUserInput): Promise<User> {
    return prisma.user.create({data});
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({where: {email}});
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({where: {id}});
  }

  async list(params?: {role?: UserRole; skip?: number; take?: number}): Promise<User[]> {
    const {role, skip, take} = params ?? {};

    return prisma.user.findMany({
      where: role ? {role} : undefined,
      skip,
      take,
      orderBy: {createdAt: 'desc'}
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    return prisma.user.update({where: {id}, data});
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({where: {id}});
  }

  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return prisma.user.count({where});
  }
}

