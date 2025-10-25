import {Prisma, Schedule} from '@prisma/client';
import dayjs from 'dayjs';

import {ScheduleRepository} from '../repositories/schedule.repository';

type Input = {
  from?: string;
  to?: string;
  serviceType?: string;
  status?: string;
  customerId?: string;
  staffId?: string;
};

export class ListSchedulesService {
  constructor(private readonly scheduleRepository = new ScheduleRepository()) {}

  async execute(filter: Input): Promise<Schedule[]> {
    const where: Prisma.ScheduleWhereInput = {};

    if (filter.from || filter.to) {
      where.scheduledAt = {
        gte: filter.from ? dayjs(filter.from).toDate() : undefined,
        lte: filter.to ? dayjs(filter.to).toDate() : undefined
      };
    }

    if (filter.serviceType) {
      where.serviceType = filter.serviceType.toUpperCase() as Prisma.ScheduleWhereInput['serviceType'];
    }

    if (filter.status) {
      where.status = filter.status.toUpperCase() as Prisma.ScheduleWhereInput['status'];
    }

    if (filter.customerId) {
      where.customerId = filter.customerId;
    }

    if (filter.staffId) {
      where.staffId = filter.staffId;
    }

    return this.scheduleRepository.list(where);
  }
}
