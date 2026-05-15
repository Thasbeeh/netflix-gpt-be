import { IsString } from 'class-validator';

class MessageDto {
  @IsString()
  content: string;
}

export default MessageDto;
