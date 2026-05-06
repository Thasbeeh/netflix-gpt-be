import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import SignUpDto from './dtos/sign-up.dto';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import RefreshTokenGuard from './guards/refresh-token.guard';
import type { AuthenticatedRequest } from './types/auth-request.type';
import type { LocalAuthRequest } from './types/local-auth-request.type';

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Req() req: LocalAuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, updatedUser } =
      await this.authService.login(req.user);

    res.cookie('rt', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token: accessToken, user: updatedUser };
  }

  @Post('/signup')
  createUser(@Body() body: SignUpDto) {
    return this.authService.createUser(
      body.displayName,
      body.email,
      body.password,
    );
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  async refresh(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, dbUser } =
      await this.authService.refresh(req.user, req.refreshToken);

    res.cookie('rt', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token: accessToken, user: dbUser };
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/logout')
  async logout(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.user.sub);

    res.clearCookie('rt', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
    });

    return { message: 'Logged out' };
  }
}
