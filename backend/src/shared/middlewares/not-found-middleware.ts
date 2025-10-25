import {Request, Response, NextFunction} from 'express';

export const notFoundMiddleware = (req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    status: 'error',
    message: `Resource ${req.originalUrl} not found`
  });
};
