import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type ScheduleDocument = Schedule & Document;

@Schema()
export class Schedule {
  @Prop({ required: true })
  Description: string;

  @Prop({ required: true })
  ScheduleDate: Date;

  @Prop({ required: true, ref: 'Admin', type: Types.ObjectId })
  AdminID: ObjectId;

  @Prop({ required: true, ref: 'Client', type: Types.ObjectId })
  ClientID: ObjectId;

  @Prop({ required: true, enum: ['MEET', 'CALL'] })
  Type: string;

  @Prop({ required: true, enum: ['DONE', 'CANCELED', 'IDLE'] })
  Status: string;

  @Prop({ default: new Date() })
  CreatedAt: Date;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
