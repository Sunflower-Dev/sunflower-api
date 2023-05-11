import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true })
  Title: string;

  @Prop({ required: true })
  Body: string;

  @Prop({ required: true })
  Type: string;

  @Prop({ default: new Date() })
  CreatedAt: Date;

  @Prop({ required: true })
  SeenBy: ObjectId[];

  @Prop({ required: true })
  DeletedBy: ObjectId[];
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
