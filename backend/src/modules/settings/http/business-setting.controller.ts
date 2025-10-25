import {Request, Response} from 'express';

import {GetBusinessSettingService} from '../services/get-business-setting.service';
import {UpdateBusinessSettingService} from '../services/update-business-setting.service';

export class BusinessSettingController {
  constructor(
    private readonly getService = new GetBusinessSettingService(),
    private readonly updateService = new UpdateBusinessSettingService()
  ) {}

  show = async (_req: Request, res: Response) => {
    const setting = await this.getService.execute();
    res.json({data: setting});
  };

  update = async (req: Request, res: Response) => {
    const setting = await this.updateService.execute(req.body);
    res.json({data: setting});
  };
}
