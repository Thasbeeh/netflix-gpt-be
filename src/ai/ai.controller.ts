import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import MessageDto from './message.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  movieRecommendations(@Body() body: MessageDto) {
    return this.aiService.movieRecommendations(body.content);
  }
}
