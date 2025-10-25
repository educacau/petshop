import {z} from 'zod';

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().cuid()
  }),
  body: z.object({
    name: z.string().min(3).optional(),
    phone: z.string().optional(),
    role: z.enum(['ADMIN', 'STAFF', 'CUSTOMER']).optional(),
    isActive: z.boolean().optional()
  })
});

export type UpdateUserDTO = {
  params: {
    id: string;
  };
  body: {
    name?: string;
    phone?: string;
    role?: 'ADMIN' | 'STAFF' | 'CUSTOMER';
    isActive?: boolean;
  };
};
