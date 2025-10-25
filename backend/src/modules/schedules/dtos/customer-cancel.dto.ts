import {z} from 'zod';

export const customerCancelSchema = z.object({
  params: z.object({
    id: z.string().cuid()
  })
});

export type CustomerCancelDTO = {
  params: {id: string};
};
