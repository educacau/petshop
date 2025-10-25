import {Router} from 'express';

import {authRouter} from '@modules/auth/http/auth.routes';
import {userRouter} from '@modules/users/http/users.routes';
import {petRouter} from '@modules/pets/http/pets.routes';
import {scheduleRouter} from '@modules/schedules/http/schedules.routes';
import {businessSettingRouter} from '@modules/settings/http/business-setting.routes';


export const routes = Router();

routes.use('/auth', authRouter);
routes.use('/users', userRouter);
routes.use('/pets', petRouter);
routes.use('/schedules', scheduleRouter);
routes.use('/settings', businessSettingRouter);

