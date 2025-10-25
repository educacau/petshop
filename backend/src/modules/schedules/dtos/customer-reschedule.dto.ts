import {z} from 'zod';

export const customerRescheduleSchema = z.object({
  params: z.object({
    id: z.string().cuid()
  }),
  body: z.object({
    scheduledAt: z.string().datetime(),
    notes: z.string().optional()
  })
});

export type CustomerRescheduleDTO = {
  params: {id: string};
  body: {scheduledAt: string; notes?: string};
};
