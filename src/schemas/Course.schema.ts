import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema()
class Lesson {
  @Prop({ required: true })
  Title: string;

  @Prop({ required: true })
  Video: string;

  @Prop({ required: true })
  ReadingTime: string;

  @Prop({ required: true, ref: 'Admin', type: Types.ObjectId })
  Passed: ObjectId[];

  @Prop({ required: true })
  Description: string;

  @Prop({ required: true })
  Order: number;
}

@Schema()
class Question {
  @Prop({ required: true })
  Question: string;

  @Prop({ required: true })
  A: string;

  @Prop({ required: true })
  B: string;

  @Prop({ required: true })
  C: string;

  @Prop({ required: true })
  D: string;

  @Prop({ required: true, enum: ['A', 'B', 'C', 'D'] })
  CorrectAnswer: string;
}

@Schema()
class Exam {
  @Prop({ required: true })
  Title: string;

  @Prop({ required: true })
  Description: string;

  @Prop([Question])
  Questions: Question[];
}

@Schema()
export class Passed {
  @Prop({ default: new Date() })
  PassedAt: Date;
  @Prop({ required: true, ref: 'Admin', type: Types.ObjectId })
  Admin: ObjectId | any;
}

@Schema()
export class Course {
  @Prop({ required: true })
  Title: string;

  @Prop({ required: true })
  Order: number;

  @Prop([Passed])
  Passed: Passed[];

  @Prop([Lesson])
  Lessons: Lesson[];

  @Prop({ required: true, type: Exam })
  Exam: Exam;

  @Prop({ default: new Date() })
  CreatedAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
