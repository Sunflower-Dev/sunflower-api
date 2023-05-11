import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  Title: string;

  @Prop({ required: true, ref: 'Admin', type: Types.ObjectId })
  Assigner: ObjectId;

  @Prop({ required: true, ref: 'Admin', type: Types.ObjectId })
  To: ObjectId;

  @Prop({ required: true, enum: ['IDLE', 'DONE'] })
  Status: string;

  @Prop({ default: new Date(), required: true })
  CreatedAt: Date;

  @Prop({ required: true })
  ExpireDate: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
