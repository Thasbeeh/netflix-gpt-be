import { Injectable } from '@nestjs/common';
import TMDBVideo from './types/tmdb-video.type';
import { TmbdService } from './tmbd.service';
import { FamilyFilterService } from './family-filter.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly tmdbService: TmbdService,
    private readonly familyFilterService: FamilyFilterService,
  ) {}

  async getNowPlayingMovies() {
    const nowPlayingMovies = await this.tmdbService.getMovies(
      'discover/movie',
      this.familyFilterService.categoryFilterParams('now_playing'),
    );

    if (!nowPlayingMovies?.length)
      return { nowPlayingMovies: [], trailerVideo: null };

    const mainMovie = nowPlayingMovies[0];
    const mainMovieVideos: TMDBVideo[] = await this.tmdbService.getMovies(
      `movie/${mainMovie.id}/videos`,
      { language: 'en-US' },
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
    const url = 'discover/movie';

    const [upcomingMovies, topRatedMovies, popularMovies] =
      await Promise.allSettled([
        this.tmdbService.getMovies(
          url,
          this.familyFilterService.categoryFilterParams('upcoming'),
        ),
        this.tmdbService.getMovies(
          url,
          this.familyFilterService.categoryFilterParams('top_rated'),
        ),
        this.tmdbService.getMovies(
          url,
          this.familyFilterService.categoryFilterParams('popular'),
        ),
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
