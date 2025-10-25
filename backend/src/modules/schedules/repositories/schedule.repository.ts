import {Prisma, Schedule, ScheduleStatus, ServiceType} from '@prisma/client';

import {prisma} from '@infra/prisma/client';

type CreateScheduleInput = {
  serviceType: ServiceType;
  scheduledAt: Date;
  status?: ScheduleStatus;
  price?: Prisma.Decimal | number;
  notes?: string;
  customerId: string;
  petId: string;
  staffId?: string;
};

type UpdateScheduleInput = Partial<CreateScheduleInput>;

export class ScheduleRepository {
  async create(data: CreateScheduleInput): Promise<Schedule> {
    return prisma.schedule.create({data});
  }

  async findById(id: string): Promise<Schedule | null> {
    return prisma.schedule.findUnique({where: {id}});
  }

  async list(filter: Prisma.ScheduleWhereInput): Promise<Schedule[]> {
    return prisma.schedule.findMany({
      where: filter,
      include: {
        customer: true,
        pet: true,
        staff: true
      },
      orderBy: {scheduledAt: 'desc'}
    });
  }

  async update(id: string, data: UpdateScheduleInput): Promise<Schedule> {
    return prisma.schedule.update({where: {id}, data});
  }

  async delete(id: string): Promise<Schedule> {
    return prisma.schedule.delete({where: {id}});
  }

  async count(filter: Prisma.ScheduleWhereInput): Promise<number> {
    return prisma.schedule.count({where: filter});
  }

  async findOverlap(staffId: string, scheduledAt: Date): Promise<Schedule | null> {
    return prisma.schedule.findFirst({
      where: {
        staffId,
        scheduledAt,
        status: {
          in: [ScheduleStatus.SCHEDULED, ScheduleStatus.IN_PROGRESS]
        }
      }
    });
  }
}
