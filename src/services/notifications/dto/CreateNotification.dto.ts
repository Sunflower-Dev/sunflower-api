import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty()
  Title: string;

  @ApiProperty()
  Body: string;

  @ApiProperty()
  Type: string;
}
