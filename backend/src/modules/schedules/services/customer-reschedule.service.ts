import dayjs from 'dayjs';

import {ScheduleRepository} from '../repositories/schedule.repository';
import {AppError} from '@core/errors/app-error';

type Input = {
  scheduleId: string;
  customerId: string;
  scheduledAt: string;
  notes?: string;
};

export class CustomerRescheduleService {
  constructor(private readonly repository = new ScheduleRepository()) {}

  async execute(params: Input) {
    const schedule = await this.repository.findById(params.scheduleId);

    if (!schedule || schedule.customerId !== params.customerId) {
      throw new AppError('Agendamento não encontrado', 404);
    }

    if (schedule.status === 'COMPLETED' || schedule.status === 'CANCELLED') {
      throw new AppError('Não é possível reagendar um atendimento finalizado', 400);
    }

    const notes = params.notes ?? schedule.notes ?? undefined;

    return this.repository.update(schedule.id, {
      scheduledAt: dayjs(params.scheduledAt).toDate(),
      notes
    });
  }
}
