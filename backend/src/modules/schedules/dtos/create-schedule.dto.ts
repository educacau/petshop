import {z} from 'zod';

export const createScheduleSchema = z.object({
  body: z.object({
    serviceType: z.enum(['BATH', 'GROOMING', 'BATH_GROOMING']),
    scheduledAt: z.string().datetime(),
    notes: z.string().optional(),
    price: z.number().positive().optional(),
    customerId: z.string().cuid(),
    petId: z.string().cuid(),
    staffId: z.string().cuid().optional()
  })
});

export type CreateScheduleDTO = z.infer<typeof createScheduleSchema>['body'];
