import {Router} from 'express';
import swaggerUi from 'swagger-ui-express';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';

const swaggerDocument = JSON.parse(
  readFileSync(join(process.cwd(), 'swagger', 'openapi.json'), 'utf-8')
);

export const swaggerRouter = Router();

swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
