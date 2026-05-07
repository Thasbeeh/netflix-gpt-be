import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getNowPlayingMovies() {
    return this.moviesService.getMovies();
  }

  @Get(':id')
  getMovieTrailerVideo(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.getMovieTrailerVideo(id);
  }
}
