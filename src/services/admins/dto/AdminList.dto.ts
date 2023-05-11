import { ApiProperty } from '@nestjs/swagger';

export class AdminList {
  @ApiProperty()
  Name: string;

  @ApiProperty()
  Avatar: string;

  @ApiProperty()
  CreatedAt: Date;

  @ApiProperty()
  _id: string;
}
