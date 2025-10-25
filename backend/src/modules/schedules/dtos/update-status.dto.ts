import {z} from 'zod';

export const updateScheduleStatusSchema = z.object({
  params: z.object({
    id: z.string().cuid()
  }),
  body: z.object({
    status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  })
});

export type UpdateScheduleStatusDTO = {
  params: {id: string};
  body: {status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'};
};
