import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
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
  Pronouns: String;
  @ApiProperty({ enum: ['Good', 'Relatively well', 'Bad'] })
  Status: String;
  @ApiProperty()
  NDIS: String;
  @ApiProperty()
  Alerts: String;
  @ApiProperty()
  PhoneNumber: string;
  @ApiProperty()
  EmergencyContact: string;
  @ApiProperty()
  Email: string;
  @ApiProperty()
  Address: string;
  @ApiProperty()
  Goals: string;

  @ApiProperty()
  About: string;

  @ApiProperty()
  Personality: string;

  @ApiProperty()
  Interests: string;

  @ApiProperty()
  Conversation: string;

  @ApiProperty()
  Triggers: string;

  @ApiProperty()
  Warnings: string;

  @ApiProperty()
  Risks: string;

  @ApiProperty()
  PreferredName: string;

  @ApiProperty()
  Aboriginal: string;

  @ApiProperty()
  Communication: string;

  @ApiProperty()
  DiseaseBackground: string[];
  @ApiProperty()
  MedicineSensitivity: string[];
  @ApiProperty()
  staffs: string[];
}
