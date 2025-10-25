import {NextFunction, Request, Response} from 'express';
import {ZodError} from 'zod';

import {AppError} from '@core/errors/app-error';
import {logger} from '@shared/logger';

export const errorMiddleware = (err: unknown, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn(`${req.method} ${req.originalUrl} -> ${err.message}`);
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      details: err.details ?? null
    });
  }

  if (err instanceof ZodError) {
    logger.warn(`${req.method} ${req.originalUrl} -> Validation failed`);
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      details: err.flatten()
    });
  }

  const error = err as Error;
  logger.error(error);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};
