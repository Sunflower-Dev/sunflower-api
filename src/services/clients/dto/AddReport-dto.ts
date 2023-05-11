import { ApiProperty } from '@nestjs/swagger';

export class AddReportDto {
  @ApiProperty()
  ContactType: string;

  @ApiProperty()
  AffectedPerson: AffectedPerson[];

  @ApiProperty()
  NotifiedPerson: NotifiedPerson[];

  @ApiProperty()
  Name: string;

  @ApiProperty()
  Position: string;

  @ApiProperty()
  Contact: string;

  @ApiProperty()
  IncidentDate: string | Date;

  @ApiProperty()
  IncidentDuration: string;

  @ApiProperty()
  Affected: string[];

  @ApiProperty()
  IncidentType: string[];

  @ApiProperty()
  IncidentTypeDescription: string;

  @ApiProperty()
  IncidentDescription: string;

  @ApiProperty()
  EmergencyService: string[];

  @ApiProperty()
  NotifiedDescription: string;

  @ApiProperty()
  OfficeName: string;

  @ApiProperty()
  OfficePhone: string;

  @ApiProperty()
  OfficeEmail: string;

  @ApiProperty()
  NDISReport: string[];

  @ApiProperty()
  NDISReason: string;
}

class AffectedPerson {
  // @ApiProperty()
  // id: '3583d7f7-2de2-4f2e-9446-5ee763a2f3ce'
  @ApiProperty()
  Name: string;

  @ApiProperty()
  Contact: string;
}

class NotifiedPerson {
  // @ApiProperty()
  // id: '3583d7f7-2de2-4f2e-9446-5ee763a2f3ce'
  @ApiProperty()
  Name: string;

  @ApiProperty()
  Contact: string;

  @ApiProperty()
  Role: string;

  @ApiProperty()
  NotifiedTime: string | Date;
}
