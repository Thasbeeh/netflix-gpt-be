import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('/main')
  getNowPlayingMovies() {
    return this.moviesService.getNowPlayingMovies();
  }

  @Get('/sections')
  getMovieSections() {
    return this.moviesService.getAggregatedMoviesList();
  }
}
