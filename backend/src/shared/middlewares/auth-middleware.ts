import {NextFunction, Request, Response} from 'express';

import {AppError} from '@core/errors/app-error';
import {verifyToken} from '@shared/utils/jwt';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}

export const authMiddleware = (roles?: string[]) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError('Authentication token is missing', 401);
    }

    const [, token] = authorization.split(' ');

    if (!token) {
      throw new AppError('Invalid authentication token', 401);
    }

    const payload = verifyToken(token);

    const {sub: id, role} = payload as {sub: string; role: string};

    if (roles && !roles.includes(role)) {
      throw new AppError('Forbidden', 403);
    }

    req.user = {id, role};

    return next();
  };
};
