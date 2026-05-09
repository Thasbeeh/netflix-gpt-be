import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TmbdService {
  private readonly baseUrl: string;
  private readonly accessToken: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>(
      'TMDB_MOVIES_BASE_URL',
    );
    this.accessToken =
      this.configService.getOrThrow<string>('TMDB_ACCESS_TOKEN');
  }

  async getMovies(category: string, page = 1) {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(
          this.baseUrl + category + '?page=' + page,
          this.getHeaders(),
        ),
      );
      return response.data.results;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  private getHeaders(): AxiosRequestConfig {
    return {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    };
  }

  private handleAxiosError(error: unknown) {
    if (!isAxiosError(error)) {
      throw error;
    }

    if (error.code === 'ERR_CANCELED')
      throw new RequestTimeoutException('Request was canceled');

    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      throw new ServiceUnavailableException('TMDB service unavailable');
    }

    if (error.response) {
      throw new HttpException(
        error.response.data?.status_message || 'TMDB API Error',
        error.response.status,
      );
    }

    throw new InternalServerErrorException('External API request failed');
  }
}
