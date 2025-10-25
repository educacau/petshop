import dayjs from 'dayjs';

import {ScheduleRepository} from '../repositories/schedule.repository';
import {AppError} from '@core/errors/app-error';
import {UserRepository} from '@modules/users/repositories/user.repository';

type Input = {
  id: string;
  scheduledAt?: Date;
  notes?: string;
  price?: number;
  staffId?: string;
};

export class UpdateScheduleService {
  constructor(
    private readonly scheduleRepository = new ScheduleRepository(),
    private readonly userRepository = new UserRepository()
  ) {}

  async execute({id, scheduledAt, notes, price, staffId}: Input) {
    const schedule = await this.scheduleRepository.findById(id);

    if (!schedule) {
      throw new AppError('Schedule not found', 404);
    }

    if (staffId) {
      const staff = await this.userRepository.findById(staffId);
      if (!staff || staff.role !== 'STAFF') {
        throw new AppError('Assigned staff not found', 404);
      }
    }

    if (staffId && scheduledAt) {
      const overlap = await this.scheduleRepository.findOverlap(
        staffId,
        dayjs(scheduledAt).toDate()
      );

      if (overlap && overlap.id !== schedule.id) {
        throw new AppError('Staff member already booked for this time slot', 409);
      }
    }

    return this.scheduleRepository.update(id, {
      scheduledAt,
      notes,
      price,
      staffId
    });
  }
}
