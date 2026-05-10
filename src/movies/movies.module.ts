import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TmbdService } from './tmbd.service';
import { FamilyFilterService } from './family-filter.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: Number(configService.get('HTTP_TIMEOUT')) || 5000,
        maxRedirects: Number(configService.get('HTTP_MAX_REDIRECTS')) || 5,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, TmbdService, FamilyFilterService],
})
export class MoviesModule {}
