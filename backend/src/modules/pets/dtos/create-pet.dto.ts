import {z} from 'zod';

export const createPetSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    species: z.string().min(2),
    breed: z.string().optional(),
    age: z.number().int().positive().optional(),
    weight: z.number().positive().optional(),
    medicalNotes: z.string().optional(),
    customerId: z.string().cuid()
  })
});

export type CreatePetDTO = z.infer<typeof createPetSchema>['body'];
