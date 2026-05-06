import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  findUser(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  createUser(displayName: string, email: string, password: string) {
    return this.prisma.user.create({
      data: {
        displayName,
        email,
        password,
      },
      omit: {
        password: true,
      },
    });
  }

  updateRefreshToken(id: number, refreshToken: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        refreshToken,
      },
      omit: {
        password: true,
        refreshToken: true,
      },
    });
  }

  deleteRefreshToken(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        refreshToken: null,
      },
    });
  }
}
