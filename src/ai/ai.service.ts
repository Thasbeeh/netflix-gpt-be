import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { MoviesService } from 'src/movies/movies.service';
import MoviesType, { MovieItem } from 'src/movies/types/movies-type';

@Injectable()
export class AiService {
  private readonly groq: Groq;
  private readonly modelId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly moviesService: MoviesService,
  ) {
    const apiKey = this.configService.getOrThrow('groq.apiKey');
    this.groq = new Groq({ apiKey });

    this.modelId = this.configService.getOrThrow('groq.model');
  }

  async generateText(content: string) {
    try {
      const response = await this.groq.chat.completions.create({
        model: this.modelId,
        messages: [{ role: 'user', content: this.gptQuery(content) }],
      });

      return response.choices[0]?.message?.content ?? '';
    } catch (error: any) {
      if (error.status === 429) {
        console.error('Rate limit reached!');
      }
    }
  }

  async movieRecommendations(content: string) {
    const response = await this.generateText(content);
    const gptResults = response?.split('|') || [];

    const movieResults = await Promise.all(
      gptResults.map((movie) => {
        const [movieName, releaseYear] = movie.split('=>');
        const year = releaseYear ? parseInt(releaseYear, 10) : 2026;
        return this.moviesService.getMovie(movieName.trim(), year);
      }),
    );

    console.log('Unfiltered length:', movieResults.length);
    console.log('Unfiltered movies:', movieResults);

    const filteredMovieResults = movieResults.filter((result) => result);

    console.log('Filtered:', filteredMovieResults);
    console.log('Filtered length:', filteredMovieResults.length);

    return filteredMovieResults; // [{ Movie 1 }, { Movie 2 }, ..., { Movie 5 }]
  }

  private gptQuery(content: string): string {
    return (
      `List 10 movies for: ${content}.` +
      'Genres: ONLY Family(10751), Animation(16). ' +
      'EXCLUDE: Horror, Crime, Thriller, Drama. ' +
      'Format: Name: Year, Name: Year. ' +
      'No intro/outro/numbers. ' +
      'Example: Toy Story=> 1995 | Finding Nemo=> 2003 | Inside Out=> 2015 | Madagascar=> 2005'
    );
  }
}
