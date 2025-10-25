import {Router} from 'express';

import {authMiddleware} from '@shared/middlewares/auth-middleware';
import {validate} from '@shared/validators/zod-parser';
import {createPetSchema} from '../dtos/create-pet.dto';
import {updatePetSchema} from '../dtos/update-pet.dto';
import {PetsController} from './pets.controller';

const controller = new PetsController();

export const petRouter = Router();

petRouter.use(authMiddleware());

petRouter.get('/', authMiddleware(['ADMIN', 'STAFF']), controller.listAll);
petRouter.get('/me', controller.listMine);
petRouter.get('/customer/:customerId', authMiddleware(['ADMIN', 'STAFF']), controller.listByCustomer);
petRouter.post('/', authMiddleware(['ADMIN', 'STAFF']), validate(createPetSchema), controller.create);
petRouter.put('/:id', authMiddleware(['ADMIN', 'STAFF']), validate(updatePetSchema), controller.update);
petRouter.delete('/:id', authMiddleware(['ADMIN', 'STAFF', 'CUSTOMER']), controller.delete);
