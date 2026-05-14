import { Injectable } from '@nestjs/common';
import { TmbdService } from './tmbd.service';
import { FamilyFilterService } from './family-filter.service';
import type MoviesType from './types/movies-type';
import type VideoType from './types/video-type';

@Injectable()
export class MoviesService {
  constructor(
    private readonly tmdbService: TmbdService,
    private readonly familyFilterService: FamilyFilterService,
  ) {}

  async getHomePageMainMovie() {
    const nowPlayingMovies = await this.getNowPlayingMovies(1);
    if (!nowPlayingMovies?.results.length)
      return {
        nowPlayingMovies: { page: 0, results: [], totalPages: 0 },
        trailerVideo: null,
      };

    const { page, results, totalPages } = nowPlayingMovies;
    const mainMovie = results[0];
    const trailerVideo = await this.getTrailerVideo(mainMovie.id);

    return {
      nowPlayingMovies: { page, results, totalPages },
      trailerVideo,
    };
  }

  async getNowPlayingMovies(pageNo: number) {
    const { page, results, total_pages }: MoviesType =
      await this.tmdbService.getMovies(
        'discover/movie',
        this.familyFilterService.categoryFilterParams('now_playing', pageNo),
      );

    return { page, results, totalPages: total_pages };
  }

  async getTrailerVideo(movieId: number) {
    const movieVideos: VideoType = await this.tmdbService.getMovies(
      `movie/${movieId}/videos`,
      { language: 'en-US' },
    );

    const trailer =
      movieVideos.results.find((video) => video.type === 'Trailer') ??
      movieVideos[0];

    if (!trailer) return null;

    return {
      id: trailer.id,
      key: trailer.key,
      site: trailer.site,
      name: trailer.name,
      url:
        trailer.site === 'YouTube'
          ? `https://www.youtube.com/embed?v=${trailer.key}`
          : null,
    };
  }

  async getUpcomingMovies(pageNo: number) {
    const { page, results, total_pages }: MoviesType =
      await this.tmdbService.getMovies(
        'discover/movie',
        this.familyFilterService.categoryFilterParams('upcoming', pageNo),
      );

    return { page, results, totalPages: total_pages };
  }

  async getTopRatedMovies(pageNo: number) {
    const { page, results, total_pages }: MoviesType =
      await this.tmdbService.getMovies(
        'discover/movie',
        this.familyFilterService.categoryFilterParams('top_rated', pageNo),
      );

    return { page, results, totalPages: total_pages };
  }

  async getPopularMovies(pageNo: number) {
    const { page, results, total_pages }: MoviesType =
      await this.tmdbService.getMovies(
        'discover/movie',
        this.familyFilterService.categoryFilterParams('popular', pageNo),
      );

    return { page, results, totalPages: total_pages };
  }

  async getAggregatedMoviesList() {
    const [upcomingMovies, topRatedMovies, popularMovies] =
      await Promise.allSettled([
        this.retryOnce(() => this.getUpcomingMovies(1)),
        this.retryOnce(() => this.getTopRatedMovies(1)),
        this.retryOnce(() => this.getPopularMovies(1)),
      ]);

    return {
      upcomingMovies:
        upcomingMovies.status === 'fulfilled' ? upcomingMovies.value : [],
      topRatedMovies:
        topRatedMovies.status === 'fulfilled' ? topRatedMovies.value : [],
      popularMovies:
        popularMovies.status === 'fulfilled' ? popularMovies.value : [],
    };
  }

  private async retryOnce<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch {
      return await fn(); // retry one more time
    }
  }
}
