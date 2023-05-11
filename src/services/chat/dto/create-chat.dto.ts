import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({ required: true })
  From: string;

  @ApiProperty({ required: true })
  To: string;

  @ApiProperty({ required: true })
  MessageType: string;

  @ApiProperty({ required: true })
  Message: string;

  @ApiProperty({ required: true })
  Status: string;

  @ApiProperty({ required: true })
  CreatedAt: Date;
}
