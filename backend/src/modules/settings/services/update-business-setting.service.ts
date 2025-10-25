import {BusinessSetting} from '@prisma/client';

import {BusinessSettingRepository} from '../repositories/business-setting.repository';

export class UpdateBusinessSettingService {
  constructor(private readonly repository = new BusinessSettingRepository()) {}

  async execute(data: {openingTime: number; closingTime: number; slotDuration: number}): Promise<BusinessSetting> {
    return this.repository.save(data);
  }
}
