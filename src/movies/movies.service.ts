import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import TMDBVideo from './types/tmdb-video.type';

@Injectable()
export class MoviesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getMovies() {
    const tmdb_aT = this.configService.get<String>('TMDB_ACCESS_TOKEN');
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${tmdb_aT}`,
      },
    };
    try {
      const url = this.configService.get<string>('TMDB_MOVIES_BASE_URL');
      const response = await firstValueFrom(
        this.httpService.get(url + 'now_playing?page=1', options),
      );
      return response.data.results;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new InternalServerErrorException(
          error.response?.data?.status_message || 'Failed to fetch movies',
        );
      }

      console.error('Unexpected Error:', error);
      throw error;
    }
  }

  async getMovieTrailerVideo(id: number) {
    const tmdb_aT = this.configService.get<String>('TMDB_ACCESS_TOKEN');
    const url = this.configService.get<string>('TMDB_MOVIES_BASE_URL');
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${tmdb_aT}`,
      },
    };
    try {
      const response = await firstValueFrom(
        this.httpService.get(url + `${id}/videos?language=en-US`, options),
      );
      const videos: TMDBVideo[] = response?.data?.results;
      let trailerVideo = videos.find((video) => video.type === 'Trailer');
      if (!trailerVideo && videos.length > 0) trailerVideo = videos[0];

      return trailerVideo
        ? {
            key: trailerVideo.key,
            site: trailerVideo.site,
            name: trailerVideo.name,
            url:
              trailerVideo.site === 'YouTube'
                ? `https://www.youtube.com/watch?v=${trailerVideo.key}`
                : null,
          }
        : null;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new InternalServerErrorException(
          error.response?.data?.status_message || 'Failed to fetch movies',
        );
      }

      console.error('Unexpected Error:', error);
      throw error;
    }
  }
}
