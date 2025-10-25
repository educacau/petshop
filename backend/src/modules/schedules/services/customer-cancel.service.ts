import {ScheduleStatus} from '@prisma/client';

import {ScheduleRepository} from '../repositories/schedule.repository';
import {AppError} from '@core/errors/app-error';

export class CustomerCancelScheduleService {
  constructor(private readonly repository = new ScheduleRepository()) {}

  async execute(params: {scheduleId: string; customerId: string}) {
    const schedule = await this.repository.findById(params.scheduleId);

    if (!schedule || schedule.customerId !== params.customerId) {
      throw new AppError('Agendamento n�o encontrado', 404);
    }

    if (schedule.status === ScheduleStatus.COMPLETED) {
      throw new AppError('N�o � poss�vel cancelar um atendimento conclu�do', 400);
    }

    return this.repository.update(schedule.id, {status: ScheduleStatus.CANCELLED});
  }
}
