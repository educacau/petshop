import {Router} from 'express';

import {authMiddleware} from '@shared/middlewares/auth-middleware';
import {validate} from '@shared/validators/zod-parser';
import {createScheduleSchema} from '../dtos/create-schedule.dto';
import {filterScheduleSchema} from '../dtos/filter-schedule.dto';
import {updateScheduleSchema} from '../dtos/update-schedule.dto';
import {customerRescheduleSchema} from '../dtos/customer-reschedule.dto';
import {customerCancelSchema} from '../dtos/customer-cancel.dto';
import {updateScheduleStatusSchema} from '../dtos/update-status.dto';
import {SchedulesController} from './schedules.controller';

const controller = new SchedulesController();

export const scheduleRouter = Router();

scheduleRouter.use(authMiddleware());

scheduleRouter.get('/', authMiddleware(['ADMIN', 'STAFF']), validate(filterScheduleSchema), controller.list);
scheduleRouter.get(
  '/summary',
  authMiddleware(['ADMIN']),
  validate(filterScheduleSchema),
  controller.summary
);
scheduleRouter.get('/me', controller.listMySchedules);
scheduleRouter.post('/', authMiddleware(['ADMIN', 'STAFF']), validate(createScheduleSchema), controller.create);
scheduleRouter.put('/:id', authMiddleware(['ADMIN', 'STAFF']), validate(updateScheduleSchema), controller.update);
scheduleRouter.patch(
  '/:id/status',
  authMiddleware(['ADMIN', 'STAFF']),
  validate(updateScheduleStatusSchema),
  controller.updateStatus
);
scheduleRouter.patch(
  '/:id/customer/reschedule',
  authMiddleware(['CUSTOMER']),
  validate(customerRescheduleSchema),
  controller.rescheduleByCustomer
);
scheduleRouter.patch(
  '/:id/customer/cancel',
  authMiddleware(['CUSTOMER']),
  validate(customerCancelSchema),
  controller.cancelByCustomer
);
scheduleRouter.delete('/:id', authMiddleware(['ADMIN', 'STAFF']), controller.delete);

