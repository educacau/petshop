import {BusinessSetting} from '@prisma/client';

import {prisma} from '@infra/prisma/client';

const DEFAULT_ID = 'default-setting';

export class BusinessSettingRepository {
  async get(): Promise<BusinessSetting | null> {
    return prisma.businessSetting.findUnique({where: {id: DEFAULT_ID}});
  }

  async save(data: Omit<BusinessSetting, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessSetting> {
    return prisma.businessSetting.upsert({
      where: {id: DEFAULT_ID},
      update: data,
      create: {
        id: DEFAULT_ID,
        ...data
      }
    });
  }
}
