import {z} from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['ADMIN', 'STAFF', 'CUSTOMER']).default('CUSTOMER'),
    phone: z.string().optional()
  })
});

export type CreateUserDTO = z.infer<typeof createUserSchema>['body'];
