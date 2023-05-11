import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type ClientDocumet = Client & Document;

@Schema()
class DeleteRequest {
  @Prop({ required: true, ref: 'Admin', type: Types.ObjectId })
  Admin: ObjectId;

  @Prop({ required: true })
  CreatedAt: Date;

  @Prop({ required: true })
  Reason: string;
}

@Schema()
class File {
  @Prop({ required: true })
  Title: string;

  @Prop({ required: true })
  File: string;

  @Prop({ required: true, ref: 'Admin', type: Types.ObjectId })
  Uploader: ObjectId;

  @Prop({ required: true })
  Type: string;

  @Prop({ required: true })
  CreatedAt: Date;

  @Prop({ required: true })
  Status: string;

  @Prop([DeleteRequest])
  DeleteRequest: DeleteRequest[];
}

@Schema()
class AffectedPerson {
  @Prop({ required: true })
  Name: string;

  @Prop({ required: true })
  Contact: string;
}

@Schema()
class NotifiedPerson {
  @Prop({ required: true })
  Name: string;

  @Prop({ required: true })
  Contact: string;

  @Prop({ required: true })
  Role: string;

  @Prop({ required: true })
  NotifiedTime: Date;
}

@Schema()
class Report {
  @Prop({ required: true })
  ContactType: string;

  @Prop([AffectedPerson])
  AffectedPerson: AffectedPerson[];

  @Prop([NotifiedPerson])
  NotifiedPerson: NotifiedPerson[];

  @Prop({ required: true })
  Name: string;

  @Prop({ required: true })
  Position: string;

  @Prop({ required: true })
  Contact: string;

  @Prop({ required: true })
  IncidentDate: Date;

  @Prop({ required: true })
  IncidentDuration: string;

  @Prop({ required: true })
  Affected: string[];

  @Prop({ required: true })
  IncidentType: string[];

  @Prop({ required: true })
  IncidentTypeDescription: string;

  @Prop({ required: true })
  IncidentDescription: string;

  @Prop({ required: true })
  EmergencyService: string[];

  @Prop({ required: true })
  NotifiedDescription: string;

  @Prop({ required: true })
  OfficeName: string;

  @Prop({ required: true })
  OfficePhone: string;

  @Prop({ required: true })
  OfficeEmail: string;

  @Prop({ required: true })
  NDISReport: string[];

  @Prop({ required: true })
  NDISReason: string;

  @Prop({ required: true })
  Signature: string;

  @Prop({ default: new Date() })
  CreatedAt: Date;

  @Prop({ ref: 'Admin', type: Types.ObjectId })
  Reporter: ObjectId;
}

@Schema()
class Pills {
  @Prop({ required: true })
  Medication: string;

  @Prop({ required: true })
  Number: string;
}

@Schema()
class Medication {
  @Prop({ required: true })
  Title: string;

  @Prop([Pills])
  Pills: Pills[];

  @Prop({ ref: 'Admin', type: Types.ObjectId })
  Admin: ObjectId;

  @Prop({ default: new Date() })
  CreatedAt: Date;
}

@Schema()
export class Client {
  @Prop({ required: true })
  Name: string;

  @Prop({ required: true })
  Sex: string;

  @Prop({ required: true })
  BirthDate: Date;

  @Prop({ required: true })
  Nationality: string;

  @Prop({ required: true })
  Language: string;

  @Prop({ required: true })
  Pronouns: String;

  @Prop({ required: true })
  NDIS: String;

  @Prop({ required: true })
  Alerts: String;

  @Prop({ required: true })
  PhoneNumber: string;

  @Prop({ required: true })
  EmergencyContact: string;

  @Prop({ required: true })
  Email: string;

  @Prop({
    required: true,
    enum: ['Active Client', 'Past Client', 'Status None'],
  })
  Status: String;

  @Prop({ required: true })
  Address: string;

  @Prop({ required: true })
  Goals: string;

  @Prop({ required: true })
  About: string;

  @Prop({ required: true })
  Personality: string;

  @Prop({ required: true })
  Interests: string;

  @Prop({ required: true })
  Conversation: string;

  @Prop({ required: true })
  Triggers: string;

  @Prop({ required: true })
  Warnings: string;

  @Prop({ required: true })
  Risks: string;

  @Prop()
  PreferredName: string;

  @Prop({ required: true })
  Aboriginal: string;

  @Prop({ required: true })
  Communication: string;

  @Prop()
  DiseaseBackground: string[];

  @Prop()
  MedicineSensitivity: string[];

  @Prop()
  Avatar: string;

  @Prop({ default: new Date() })
  CreatedAt: Date;

  @Prop({ ref: 'Admin', type: [Types.ObjectId] })
  Admins: ObjectId[];

  @Prop([File])
  Documents: File[];

  @Prop([Report])
  Reports: Report[];

  @Prop([Medication])
  Medications: Medication[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
