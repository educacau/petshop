import {ScheduleRepository} from '../repositories/schedule.repository';
import {AppError} from '@core/errors/app-error';

export class DeleteScheduleService {
  constructor(private readonly scheduleRepository = new ScheduleRepository()) {}

  async execute(id: string) {
    const schedule = await this.scheduleRepository.findById(id);

    if (!schedule) {
      throw new AppError('Schedule not found', 404);
    }

    return this.scheduleRepository.delete(id);
  }
}
