import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private repo: UsersRepository) {}

  findUser(email: string) {
    return this.repo.findUser(email);
  }

  createUser(displayName: string, email: string, password: string) {
    return this.repo.createUser(displayName, email, password);
  }

  updateRefreshToken(id: number, refreshToken: string) {
    return this.repo.updateRefreshToken(id, refreshToken);
  }

  deleteRefreshToken(id: number) {
    return this.repo.deleteRefreshToken(id);
  }
}
