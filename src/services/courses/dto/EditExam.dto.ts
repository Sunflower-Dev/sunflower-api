import { ApiProperty } from '@nestjs/swagger';

export class EditExamDto {
  @ApiProperty()
  Title: string;

  @ApiProperty()
  Description: string;

  @ApiProperty()
  Questions: Question[];
}

class Question {
  @ApiProperty()
  Question: string;

  @ApiProperty()
  A: string;

  @ApiProperty()
  B: string;

  @ApiProperty()
  C: string;

  @ApiProperty()
  D: string;

  @ApiProperty({ enum: ['A', 'B', 'C', 'D'] })
  CorrectAnswer: string;
}
