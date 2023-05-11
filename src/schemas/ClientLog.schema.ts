import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type ClientLogDocument = ClientLog & Document;

@Schema()
export class ClientLog {
  @Prop({ required: true })
  Change: string;

  @Prop({ required: true, enum: ['ADD', 'EDIT', 'DELETE'] })
  Type: string;

  @Prop({ required: true, ref: 'Admin', type: Types.ObjectId })
  Admin: ObjectId;

  @Prop({ required: true, ref: 'Client', type: Types.ObjectId })
  Client: ObjectId;

  @Prop({ default: new Date(), required: true })
  CreatedAt: Date;
}

export const ClientLogSchema = SchemaFactory.createForClass(ClientLog);
