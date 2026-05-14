import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('/main')
  getHomePageMainMovie() {
    return this.moviesService.getHomePageMainMovie();
  }

  @Get('/now-playing')
  getNowPlayingMovies(@Query('page', ParseIntPipe) page: number) {
    return this.moviesService.getNowPlayingMovies(page);
  }

  @Get('/popular')
  getpopularMovies(@Query('page', ParseIntPipe) page: number) {
    return this.moviesService.getPopularMovies(page);
  }

  @Get('/upcoming')
  getUpcomingMovies(@Query('page', ParseIntPipe) page: number) {
    return this.moviesService.getUpcomingMovies(page);
  }

  @Get('/top-rated')
  getTopRatedMovies(@Query('page', ParseIntPipe) page: number) {
    return this.moviesService.getTopRatedMovies(page);
  }

  @Get('/sections')
  getMovieSections() {
    return this.moviesService.getAggregatedMoviesList();
  }
}
