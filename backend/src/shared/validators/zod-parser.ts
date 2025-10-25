import {AnyZodObject} from 'zod';
import {Request, Response, NextFunction} from 'express';

export const validate =
  (schema: AnyZodObject) => async (req: Request, _res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      params: req.params,
      query: req.query
    });

    return next();
  };
