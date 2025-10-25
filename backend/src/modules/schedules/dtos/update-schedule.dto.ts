import {z} from 'zod';

export const updateScheduleSchema = z.object({
  params: z.object({
    id: z.string().cuid()
  }),
  body: z.object({
    scheduledAt: z.string().datetime().optional(),
    notes: z.string().optional(),
    price: z.number().positive().optional(),
    staffId: z.string().cuid().optional()
  })
});

export type UpdateScheduleDTO = {
  params: {id: string};
  body: {
    scheduledAt?: string;
    notes?: string;
    price?: number;
    staffId?: string;
  };
};
