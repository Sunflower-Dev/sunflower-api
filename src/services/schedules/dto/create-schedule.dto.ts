import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty()
  Description: string;

  @ApiProperty()
  ScheduleDate: string;

  @ApiProperty()
  ScheduleTime: string;

  @ApiProperty()
  AdminID: string;

  @ApiProperty()
  ClientID: string;

  @ApiProperty({ required: true, enum: ['MEET', 'CALL'] })
  Type: string;
}
