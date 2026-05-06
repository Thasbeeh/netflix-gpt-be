import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import JwtPayloadType from './types/jwt-payload.type';

@Injectable()
class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private generateToken(
    payload: JwtPayloadType,
    secret: string,
    expiresIn: StringValue,
  ) {
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  generateAccessToken(payload: Omit<JwtPayloadType, 'type'>) {
    return this.generateToken(
      { ...payload, type: 'access' },
      this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
      this.configService.getOrThrow<StringValue>('ACCESS_TOKEN_EXPIRY'),
    );
  }

  generateRefreshToken(payload: Omit<JwtPayloadType, 'type'>) {
    return this.generateToken(
      { ...payload, type: 'refresh' },
      this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_EXPIRY'),
    );
  }

  verifyAccessToken(token: string): JwtPayloadType {
    const payload = this.jwtService.verify<JwtPayloadType>(token, {
      secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
    });

    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid access token');
    }

    return payload;
  }

  verifyRefreshToken(token: string): JwtPayloadType {
    const payload = this.jwtService.verify<JwtPayloadType>(token, {
      secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
    });

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return payload;
  }
}

export default TokenService;
