import {ScheduleStatus} from '@prisma/client';

import {ScheduleRepository} from '../repositories/schedule.repository';
import {AppError} from '@core/errors/app-error';

type Input = {
  id: string;
  status: ScheduleStatus;
};

export class UpdateScheduleStatusService {
  constructor(private readonly scheduleRepository = new ScheduleRepository()) {}

  async execute({id, status}: Input) {
    const schedule = await this.scheduleRepository.findById(id);

    if (!schedule) {
      throw new AppError('Schedule not found', 404);
    }

    return this.scheduleRepository.update(id, {status});
  }
}
