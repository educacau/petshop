import {Router} from 'express';

import {authMiddleware} from '@shared/middlewares/auth-middleware';
import {validate} from '@shared/validators/zod-parser';
import {updateBusinessSettingSchema} from '../dtos/update-business-setting.dto';
import {BusinessSettingController} from './business-setting.controller';

const controller = new BusinessSettingController();

export const businessSettingRouter = Router();

businessSettingRouter.use(authMiddleware(['ADMIN']));
businessSettingRouter.get('/', controller.show);
businessSettingRouter.put('/', validate(updateBusinessSettingSchema), controller.update);
