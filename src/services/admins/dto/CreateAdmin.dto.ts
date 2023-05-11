import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty()
  Name: string;
  @ApiProperty()
  Sex: string;
  @ApiProperty()
  BirthDate: string;
  @ApiProperty()
  Nationality: string;
  @ApiProperty()
  Language: string;
  @ApiProperty()
  PhoneNumber: string;
  @ApiProperty()
  Email: string;
  @ApiProperty()
  Address: string;
  @ApiProperty()
  About: string;
  @ApiProperty()
  Permissions: {
    View: string[];
    Edit: string[];
    Delete: string[];
  };

  @ApiProperty()
  Clients_IDs: string[];
}
