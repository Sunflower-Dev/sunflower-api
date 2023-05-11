import { ApiProperty } from '@nestjs/swagger';
export class CreateLogDto {
  @ApiProperty()
  Change: string;

  @ApiProperty()
  Client: string;

  @ApiProperty({ enum: ['ADD', 'EDIT', 'DELETE'] })
  Type: string;
}
