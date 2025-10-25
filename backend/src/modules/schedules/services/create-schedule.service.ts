import {Schedule, ScheduleStatus, ServiceType} from '@prisma/client';
import dayjs from 'dayjs';

import {ScheduleRepository} from '../repositories/schedule.repository';
import {AppError} from '@core/errors/app-error';
import {UserRepository} from '@modules/users/repositories/user.repository';
import {PetRepository} from '@modules/pets/repositories/pet.repository';
import {Notifier} from '@shared/notifications/notifier';

type Input = {
  serviceType: ServiceType;
  scheduledAt: Date;
  notes?: string;
  price?: number;
  customerId: string;
  petId: string;
  staffId?: string;
};

export class CreateScheduleService {
  constructor(
    private readonly scheduleRepository = new ScheduleRepository(),
    private readonly userRepository = new UserRepository(),
    private readonly petRepository = new PetRepository(),
    private readonly notifier = new Notifier()
  ) {}

  async execute(data: Input): Promise<Schedule> {
    const customer = await this.userRepository.findById(data.customerId);

    if (!customer || customer.role !== 'CUSTOMER') {
      throw new AppError('Customer not found', 404);
    }

    const pet = await this.petRepository.findById(data.petId);

    if (!pet || pet.customerId !== customer.id) {
      throw new AppError('Pet not found for this customer', 404);
    }

    if (data.staffId) {
      const staff = await this.userRepository.findById(data.staffId);
      if (!staff || staff.role !== 'STAFF') {
        throw new AppError('Assigned staff not found', 404);
      }

      const overlap = await this.scheduleRepository.findOverlap(
        data.staffId,
        dayjs(data.scheduledAt).toDate()
      );

      if (overlap) {
        throw new AppError('Staff member already booked for this time slot', 409);
      }
    }

    const schedule = await this.scheduleRepository.create({
      ...data,
      status: ScheduleStatus.SCHEDULED
    });

    await this.notifier.send({
      to: customer.email,
      subject: 'Confirmacao de agendamento',
      message: `Ola ${customer.name}, seu agendamento para ${data.serviceType.toLowerCase()} do pet ${pet.name} foi registrado para ${dayjs(
        data.scheduledAt
      ).format('DD/MM/YYYY HH:mm')}.`
    });

    return schedule;
  }
}
