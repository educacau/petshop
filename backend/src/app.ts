import 'express-async-errors';
import express, {Application} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';

import {errorMiddleware} from '@shared/middlewares/error-middleware';
import {notFoundMiddleware} from '@shared/middlewares/not-found-middleware';
import {routes} from '@shared/routes';
import {config} from '@config/env';
import {swaggerRouter} from '@shared/routes/swagger.routes';
import {loggerStream} from '@shared/logger/stream';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());

  const allowedOrigins = config.server.allowedOrigins;
  const allowAllOrigins = allowedOrigins.includes('*');

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowAllOrigins || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error('Origin not allowed by CORS'));
      },
      credentials: true
    })
  );
  app.use(hpp());
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(
    morgan('combined', {
      stream: loggerStream,
      skip: req => req.path === '/' || req.path === '/favicon.ico'
    })
  );

  app.get('/', (_, res) => {
    res.redirect(config.swagger.baseUrl);
  });

  app.get('/health', (_, res) => {
    res.json({status: 'ok'});
  });

  app.use('/api', routes);
  app.use(config.swagger.baseUrl, swaggerRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};
