import { ApiProperty } from '@nestjs/swagger';

export class addDocumentClientDto {
  @ApiProperty()
  Title: string;

  @ApiProperty()
  File: string;

  @ApiProperty()
  Uploader: string;

  @ApiProperty()
  Type: string;

  @ApiProperty()
  CreatedAt: Date;

  @ApiProperty()
  Status: string;
}
