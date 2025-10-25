import {Router} from 'express';

import {validate} from '@shared/validators/zod-parser';
import {authMiddleware} from '@shared/middlewares/auth-middleware';
import {loginSchema} from '../dtos/login.dto';
import {registerSchema} from '../dtos/register.dto';
import {AuthController} from './auth.controller';

const controller = new AuthController();

export const authRouter = Router();

authRouter.post('/login', validate(loginSchema), controller.login);
authRouter.post('/register', validate(registerSchema), controller.register);
authRouter.get('/me', authMiddleware(), controller.me);
