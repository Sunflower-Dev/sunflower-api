import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ required: true, ref: 'Admin', type: Types.ObjectId })
  From: ObjectId;

  @Prop({ required: true, ref: 'Client', type: Types.ObjectId })
  To: ObjectId;

  @Prop({ required: true })
  Message: string;

  @Prop({ required: true, enum: ['TEXT', 'IMAGE', 'FILE'] })
  MessageType: string;

  @Prop()
  DeletedBy: ObjectId[];

  @Prop({ required: true, enum: ['SENT', 'SEEN'] })
  Status: string;

  @Prop({ default: new Date() })
  CreatedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
