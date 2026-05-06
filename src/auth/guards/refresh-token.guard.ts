import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import TokenService from '../token.service';

@Injectable()
class RefreshTokenGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.rt;
    if (!token) throw new UnauthorizedException('Refresh token missing');

    const payload = this.tokenService.verifyRefreshToken(token);

    request.user = payload;
    request.refreshToken = token;

    return true;
  }
}

export default RefreshTokenGuard;
