import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema()
class Permissions {
  @Prop({ required: true })
  View: string[];

  @Prop({ required: true })
  Edit: string[];

  @Prop({ required: true })
  Delete: string[];
}

@Schema()
class RecoverCodes {
  @Prop({ required: true })
  Code: number;

  @Prop({ default: new Date() })
  CreatedAt: Date;
}

@Schema()
export class Admin {
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

  @Prop({ unique: true, required: true })
  PhoneNumber: string;

  @Prop({ unique: true, required: true })
  Email: string;

  @Prop({ required: true })
  Address: string;

  @Prop({ required: true })
  About: string;

  @Prop({ required: true, type: Permissions })
  Permissions: {
    View: string[];
    Edit: string[];
    Delete: string[];
  };

  @Prop({ ref: 'Client', type: [Types.ObjectId] })
  Clients_IDs: ObjectId[];

  @Prop({ required: true })
  Password: string;
  @Prop()
  Avatar: string;

  @Prop({ default: new Date() })
  CreatedAt: Date;

  @Prop([RecoverCodes])
  RecoverCodes: RecoverCodes[];
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
