import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty()
  Title: string;

  @ApiProperty()
  Video: string;

  @ApiProperty()
  ReadingTime: string;

  @ApiProperty()
  Description: string;
}
