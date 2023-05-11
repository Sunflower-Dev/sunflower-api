import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type OnlineOfficeDocument = OnlineOffice & Document;

@Schema()
class Note {
  @Prop({ required: true })
  Title: string;

  @Prop({ required: true })
  Description: string;

  @Prop({ required: true, ref: 'Admin', type: Types.ObjectId })
  Admin: ObjectId;

  @Prop({ default: new Date() })
  CreatedAt: Date;
}

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
class Folder {
  @Prop({ required: true })
  Title: string;

  @Prop([File])
  Documents: File[];
}

@Schema()
class Service {
  @Prop({ required: true })
  Title: string;

  @Prop({ required: true })
  Description: string;

  @Prop({ default: new Date() })
  CreatedAt: Date;

  @Prop([Folder])
  Folders: Folder[];
}

@Schema()
export class OnlineOffice {
  @Prop([File])
  Documents: File[];

  @Prop([Note])
  Notes: Note[];

  @Prop([Service])
  Services: Service[];
}

export const OnlineOfficeSchema = SchemaFactory.createForClass(OnlineOffice);
