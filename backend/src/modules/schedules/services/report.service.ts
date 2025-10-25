import {ServiceType, ScheduleStatus} from '@prisma/client';
import dayjs from 'dayjs';

import {prisma} from '@infra/prisma/client';

type SummaryInput = {
  from?: string;
  to?: string;
};

export class ScheduleReportService {
  async summary({from, to}: SummaryInput) {
    const start = from ? dayjs(from).toDate() : dayjs().subtract(30, 'day').toDate();
    const end = to ? dayjs(to).toDate() : dayjs().toDate();

    const where = {
      scheduledAt: {
        gte: start,
        lte: end
      }
    };

    const [servicesPerformed, byServiceType, petGroups] = await Promise.all([
      prisma.schedule.count({
        where: {
          ...where,
          status: ScheduleStatus.COMPLETED
        }
      }),
      prisma.schedule.groupBy({
        by: ['serviceType'] as const,
        _count: true,
        where
      }),
      prisma.schedule.groupBy({
        by: ['petId'] as const,
        where,
        _count: true
      })
    ]);

    const revenue = await prisma.schedule.aggregate({
      _sum: {
        price: true
      },
      where: {
        ...where,
        status: ScheduleStatus.COMPLETED
      }
    });

    return {
      range: {from: start, to: end},
      totalCompleted: servicesPerformed,
      revenue: revenue._sum.price ? Number(revenue._sum.price) : 0,
      petsAttended: petGroups.length,
      byServiceType: byServiceType.map(item => ({
        serviceType: item.serviceType as ServiceType,
        total: item._count
      }))
    };
  }
}
