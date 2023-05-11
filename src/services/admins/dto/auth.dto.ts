import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  Email: string;
  @ApiProperty()
  Password: string;
}
