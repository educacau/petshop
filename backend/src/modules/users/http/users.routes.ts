import {Router} from 'express';

import {authMiddleware} from '@shared/middlewares/auth-middleware';
import {validate} from '@shared/validators/zod-parser';
import {createUserSchema} from '../dtos/create-user.dto';
import {updateUserSchema} from '../dtos/update-user.dto';
import {UsersController} from './users.controller';

const controller = new UsersController();

export const userRouter = Router();

userRouter.use(authMiddleware(['ADMIN']));

userRouter.get('/', authMiddleware(['ADMIN', 'STAFF']), controller.index);
userRouter.post('/', validate(createUserSchema), controller.store);
userRouter.put('/:id', validate(updateUserSchema), controller.update);
userRouter.delete('/:id', controller.destroy);
