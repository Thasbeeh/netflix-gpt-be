// auth/types/local-auth-request.type.ts
import { Request } from 'express';
import JwtPayloadType from './jwt-payload.type';

export interface LocalAuthRequest extends Request {
  user: JwtPayloadType;
}
