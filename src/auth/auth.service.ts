import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import TokenService from './token.service';
import JwtPayloadType from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUser(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentiails');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.tokenService.generateAccessToken(payload);

    const refreshToken = this.tokenService.generateRefreshToken(payload);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const updatedUser = await this.usersService.updateRefreshToken(
      user.id,
      hashedRefreshToken,
    );

    return { accessToken, refreshToken, updatedUser };
  }

  async createUser(displayName: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await this.usersService.createUser(
        displayName,
        email,
        hashedPassword,
      );
      const payload = { email: user.email, sub: user.id };
      return {
        access_token: this.tokenService.generateAccessToken(payload),
        user: { displayName, email },
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async refresh(user: JwtPayloadType, refreshToken: string) {
    const dbUser = await this.usersService.findUser(user.email);
    if (!dbUser || !dbUser.refreshToken) throw new UnauthorizedException();

    const isValid = await bcrypt.compare(refreshToken, dbUser.refreshToken);
    if (!isValid) throw new UnauthorizedException();

    const newPayload = { sub: dbUser.id, email: dbUser.email };

    const accessToken = this.tokenService.generateAccessToken(newPayload);
    const newRefreshToken = this.tokenService.generateRefreshToken(newPayload);

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.usersService.updateRefreshToken(dbUser.id, hashedRefreshToken);

    return { accessToken, refreshToken: newRefreshToken, dbUser };
  }

  async logout(userId: number) {
    return this.usersService.deleteRefreshToken(userId);
  }
}
