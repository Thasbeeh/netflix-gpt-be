// auth/types/authenticated-request.type.ts
import { Request } from 'express';
import JwtPayloadType from './jwt-payload.type';

export interface AuthenticatedRequest extends Request {
  user: JwtPayloadType;
  refreshToken: string;
}
