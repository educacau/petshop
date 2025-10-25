import jwt from 'jsonwebtoken';

import {config} from '@config/env';

type Payload = Record<string, unknown>;

export const signToken = (payload: Payload) =>
  jwt.sign(payload, config.auth.secret, {expiresIn: config.auth.expiresIn});

export const verifyToken = (token: string) =>
  jwt.verify(token, config.auth.secret) as Payload & {sub: string};
