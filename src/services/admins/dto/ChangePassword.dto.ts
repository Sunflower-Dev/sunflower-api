import { ApiProperty } from '@nestjs/swagger';

export class ChangePassword {
  @ApiProperty()
  CurrentPassword: string;

  @ApiProperty()
  NewPassword: string;
}
