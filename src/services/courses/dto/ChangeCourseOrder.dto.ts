import { ApiProperty } from '@nestjs/swagger';

export class ChangeCourseOrderDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  Order: number;
}
