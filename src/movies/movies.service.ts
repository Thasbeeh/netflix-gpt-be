import { Injectable } from '@nestjs/common';
import TMDBVideo from './types/tmdb-video.type';
import { TmbdService } from './tmbd.service';

@Injectable()
export class MoviesService {
  constructor(private readonly tmdbService: TmbdService) {}

  async getNowPlayingMovies() {
    const nowPlayingMovies = await this.tmdbService.getMovies('now_playing');

    if (!nowPlayingMovies?.length) {
      return { nowPlayingMovies: [], trailerVideo: null };
    }

    const mainMovie = nowPlayingMovies[3];
    const mainMovieVideos: TMDBVideo[] = await this.tmdbService.getMovies(
      `${mainMovie.id}/videos?language=en-US`,
    );

    const trailer =
      mainMovieVideos.find((video) => video.type === 'Trailer') ??
      mainMovieVideos[0];

    return {
      nowPlayingMovies,
      trailerVideo: trailer
        ? {
            key: trailer.key,
            site: trailer.site,
            name: trailer.name,
            url:
              trailer.site === 'YouTube'
                ? `https://www.youtube.com/watch?v=${trailer.key}`
                : null,
          }
        : null,
    };
  }

  async getAggregatedMoviesList() {
    const [upcomingMovies, topRatedMovies, popularMovies] =
      await Promise.allSettled([
        this.tmdbService.getMovies('upcoming'),
        this.tmdbService.getMovies('top_rated'),
        this.tmdbService.getMovies('popular'),
      ]);

    return {
      upcomingMovies:
        upcomingMovies.status === 'fulfilled' ? upcomingMovies.value : null,
      topRatedMovies:
        topRatedMovies.status === 'fulfilled' ? topRatedMovies.value : null,
      popularMovies:
        popularMovies.status === 'fulfilled' ? popularMovies.value : null,
    };
  }
}
