import { ApiProperty } from '@nestjs/swagger';
export class CreateTaskDto {
  @ApiProperty()
  Title: string;

  @ApiProperty()
  ExpireDate: string;

  @ApiProperty()
  To: string;
}
