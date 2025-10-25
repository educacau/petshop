import {z} from 'zod';

export const updatePetSchema = z.object({
  params: z.object({
    id: z.string().cuid()
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    species: z.string().min(2).optional(),
    breed: z.string().optional(),
    age: z.number().int().positive().optional(),
    weight: z.number().positive().optional(),
    medicalNotes: z.string().optional()
  })
});

export type UpdatePetDTO = {
  params: {id: string};
  body: {
    name?: string;
    species?: string;
    breed?: string | null;
    age?: number | null;
    weight?: number | null;
    medicalNotes?: string | null;
  };
};
