import {z} from 'zod';

export const filterScheduleSchema = z.object({
  query: z.object({
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    serviceType: z.enum(['BATH', 'GROOMING', 'BATH_GROOMING']).optional(),
    status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
    customerId: z.string().cuid().optional(),
    staffId: z.string().cuid().optional()
  })
});

export type FilterScheduleDTO = z.infer<typeof filterScheduleSchema>['query'];
