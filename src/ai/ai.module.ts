import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { ConfigModule, registerAs } from '@nestjs/config';
import { AiController } from './ai.controller';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  imports: [
    ConfigModule.forFeature(
      registerAs('groq', () => ({
        apiKey: process.env.GROQ_API_KEY,
        model: process.env.GROQ_MODEL_ID,
      })),
    ),
    MoviesModule,
  ],
  providers: [AiService],
  exports: [AiService],
  controllers: [AiController],
})
export class AiModule {}
