import {z} from 'zod';

export const updateBusinessSettingSchema = z.object({
  body: z.object({
    openingTime: z.number().int().min(0).max(23),
    closingTime: z.number().int().min(0).max(23),
    slotDuration: z.number().int().positive().max(180)
  }).refine(data => data.closingTime > data.openingTime, {
    message: 'closingTime must be greater than openingTime'
  })
});

export type UpdateBusinessSettingDTO = z.infer<typeof updateBusinessSettingSchema>['body'];
