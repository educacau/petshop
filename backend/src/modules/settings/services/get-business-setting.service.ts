import {BusinessSetting} from '@prisma/client';

import {BusinessSettingRepository} from '../repositories/business-setting.repository';

export class GetBusinessSettingService {
  constructor(private readonly repository = new BusinessSettingRepository()) {}

  async execute(): Promise<BusinessSetting> {
    const existing = await this.repository.get();

    if (existing) {
      return existing;
    }

    return this.repository.save({openingTime: 8, closingTime: 18, slotDuration: 60});
  }
}
