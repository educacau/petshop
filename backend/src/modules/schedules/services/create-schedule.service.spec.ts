import type {Schedule} from '@prisma/client';
import dayjs from 'dayjs';

import {AppError} from '@core/errors/app-error';
import {CreateScheduleService} from './create-schedule.service';
import type {ScheduleRepository} from '../repositories/schedule.repository';
import type {UserRepository} from '@modules/users/repositories/user.repository';
import type {PetRepository} from '@modules/pets/repositories/pet.repository';
import type {Notifier} from '@shared/notifications/notifier';

const baseInput = {
  serviceType: 'BATH' as const,
  scheduledAt: new Date('2024-10-23T10:00:00Z'),
  customerId: 'cust-01',
  petId: 'pet-01',
  staffId: 'staff-01'
};

const buildService = ({
  scheduleRepository,
  userRepository,
  petRepository,
  notifier
}: {
  scheduleRepository: jest.Mocked<Pick<ScheduleRepository, 'findOverlap' | 'create'>>;
  userRepository: jest.Mocked<Pick<UserRepository, 'findById'>>;
  petRepository: jest.Mocked<Pick<PetRepository, 'findById'>>;
  notifier: jest.Mocked<Pick<Notifier, 'send'>>;
}) =>
  new CreateScheduleService(
    scheduleRepository as unknown as ScheduleRepository,
    userRepository as unknown as UserRepository,
    petRepository as unknown as PetRepository,
    notifier as unknown as Notifier
  );

describe('CreateScheduleService', () => {
  it('throws when staff member already has a schedule for the same slot', async () => {
    const scheduleRepository = {
      findOverlap: jest.fn().mockResolvedValue({id: 'existing'}),
      create: jest.fn()
    };
    const userRepository = {
      findById: jest
        .fn()
        .mockImplementation((id: string) =>
          id === 'cust-01'
            ? {id: 'cust-01', role: 'CUSTOMER'}
            : {id: 'staff-01', role: 'STAFF'}
        )
    };
    const petRepository = {
      findById: jest.fn().mockResolvedValue({id: 'pet-01', customerId: 'cust-01'})
    };
    const notifier = {
      send: jest.fn()
    };

    const service = buildService({
      scheduleRepository: scheduleRepository as any,
      userRepository: userRepository as any,
      petRepository: petRepository as any,
      notifier: notifier as any
    });

    await expect(service.execute(baseInput)).rejects.toEqual(
      new AppError('Staff member already booked for this time slot', 409)
    );
    expect(scheduleRepository.create).not.toHaveBeenCalled();
  });

  it('creates schedule and notifies customer when data is valid', async () => {
    const schedule: Schedule = {
      id: 'sched-01',
      serviceType: 'BATH',
      scheduledAt: dayjs(baseInput.scheduledAt).toDate(),
      status: 'SCHEDULED',
      notes: null,
      price: null,
      customerId: 'cust-01',
      petId: 'pet-01',
      staffId: 'staff-01',
      createdAt: new Date(),
      updatedAt: new Date(),
      cancelledAt: null
    };

    const scheduleRepository = {
      findOverlap: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(schedule)
    };
    const userRepository = {
      findById: jest
        .fn()
        .mockImplementation((id: string) =>
          id === 'cust-01'
            ? {id: 'cust-01', role: 'CUSTOMER', email: 'customer@test.dev', name: 'Jane'}
            : {id: 'staff-01', role: 'STAFF'}
        )
    };
    const petRepository = {
      findById: jest.fn().mockResolvedValue({id: 'pet-01', customerId: 'cust-01', name: 'Bolt'})
    };
    const notifier = {
      send: jest.fn().mockResolvedValue(undefined)
    };

    const service = buildService({
      scheduleRepository: scheduleRepository as any,
      userRepository: userRepository as any,
      petRepository: petRepository as any,
      notifier: notifier as any
    });

    const result = await service.execute(baseInput);

    expect(result).toEqual(schedule);
    expect(notifier.send).toHaveBeenCalledWith({
      to: 'customer@test.dev',
      subject: 'Confirmacao de agendamento',
      message: expect.stringContaining('Ola Jane')
    });
  });
});
