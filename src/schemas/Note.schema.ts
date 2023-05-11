import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema()
export class Note {
  @Prop({ required: true })
  Title: string;

  @Prop({ required: true })
  Description: string;

  @Prop({ required: true, ref: 'Admin', type: Types.ObjectId })
  Admin: ObjectId;

  @Prop({ required: true, ref: 'Client', type: Types.ObjectId })
  Client: ObjectId;

  @Prop({ default: new Date() })
  CreatedAt: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
