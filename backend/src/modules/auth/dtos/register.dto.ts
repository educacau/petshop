import {z} from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().optional()
  })
});

export type RegisterDTO = z.infer<typeof registerSchema>['body'];
