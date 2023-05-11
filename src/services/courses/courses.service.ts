import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from 'src/schemas/Course.schema';
import { ChangeCourseOrderDto } from './dto/ChangeCourseOrder.dto';
import { CreateCourseDto } from './dto/CreateCourse.dto';
import { CreateLessonDto } from './dto/CreateLesson.dto';
import { EditExamDto } from './dto/EditExam.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async GetCourseAPI() {
    const CourseList = await this.GetCourseList();

    return CourseList;
  }

  async GetExamDescription(CourseId: string, Requester: string): Promise<any> {
    const Course = await this.courseModel.findOne({ _id: CourseId });
    var data = {
      Title: Course.Exam.Title,
      Description: Course.Exam.Description,
      CanPass: false,
      IsPassed: false,
      Score: Course.Exam.Questions.length,
    };

    Course.Lessons.forEach((element) => {
      if (element.Passed.includes(Requester as any)) {
        data.CanPass = true;
      } else {
        data.CanPass = false;
      }
    });

    if (Course.Passed.some((item) => item.Admin == (Requester as any))) {
      data.IsPassed = true;
    } else {
      data.IsPassed = false;
    }
    return data;
  }

  async CreateCourse(Title: string) {
    const maxOrderItem = await this.courseModel
      .find({}, {}, { sort: { Order: -1 } })
      .exec();
    var CourseOrder = 1;
    if (maxOrderItem.length > 0) {
      CourseOrder = maxOrderItem[0].Order + 1;
    }
    const newCourse = await new this.courseModel({
      Title,
      Order: CourseOrder,
      Passed: [],
      Lessons: [],
      Exam: {
        Title: 'EXAM TITLE',
        Description: 'Exam Description',
        Questions: [],
      },
      CreatedAt: new Date(),
    }).save();
    return this.GetCourseList();
  }

  async CreateLesson(dto: CreateLessonDto, CourseID: string) {
    const ThisCourse = await this.courseModel.findOne({ _id: CourseID });
    var LessonOrder = ThisCourse.Lessons.length + 1;

    const Update = await this.courseModel
      .updateOne(
        { _id: CourseID },
        { $push: { Lessons: { ...dto, Order: LessonOrder, Passed: [] } } },
      )
      .exec();
    return Update;
  }

  async ChangeCourseOrder(dto: ChangeCourseOrderDto[]) {
    dto.forEach(async (item) => {
      await this.courseModel
        .updateOne({ _id: item.id }, { $set: { Order: item.Order } })
        .exec();
    });
    return 'ok';
  }

  async ChangeLessonOrder(dto: ChangeCourseOrderDto[], CourseID: string) {
    dto.forEach(async (item) => {
      await this.courseModel
        .updateOne(
          { 'Lessons._id': item.id },
          { $set: { 'Lessons.$.Order': item.Order } },
        )
        .exec();
    });
    return 'ok';
  }

  async GetCourseList() {
    const CourseList = await this.courseModel
      .find({}, {}, { sort: { Order: 1 } })
      .select(
        '_id Order Title CreatedAt Passed Lessons.Title Lessons._id Lessons.Order Exam.Title Exam._id Lessons.Passed Exam.Questions',
      );
    return CourseList;
  }

  async GetCourseItem(id: string) {
    const CourseItem = await this.courseModel
      .findOne({ _id: id }, {}, { sort: { Order: 1 } })
      .select(
        '_id Order Title CreatedAt Passed Lessons.Title Lessons._id Lessons.Order Exam.Title Exam._id',
      );
    return CourseItem;
  }

  async GetLesson(LessonId: string, AdminId: string): Promise<any> {
    const Course = await this.courseModel
      .findOne({ 'Lessons._id': LessonId })
      .select('Lessons.$ Title');
    var Lesson = {
      Title: Course.Lessons[0].Title,
      Video: Course.Lessons[0].Video,
      Description: Course.Lessons[0].Description,
      Order: Course.Lessons[0].Order,
      ReadingTime: Course.Lessons[0].ReadingTime,
      IsPassed: false,
    };

    if (Course.Lessons[0].Passed.includes(AdminId as any)) {
      Lesson.IsPassed = true;
    }

    return { Lesson, CourseTitle: Course.Title };
  }

  async PassLesson(LessonId: string, AdminID: any) {
    const Updated = await this.courseModel
      .updateOne(
        { 'Lessons._id': LessonId },
        { $push: { 'Lessons.$.Passed': AdminID } },
      )
      .exec();
    return Updated;
  }

  async EditCourse(dto: CreateCourseDto, CourseId: string) {
    const Update = await this.courseModel
      .updateOne({ _id: CourseId }, { $set: { Title: dto.Title } })
      .exec();
    return Update;
  }

  async EditLessonWithVideo(dto: CreateLessonDto, LessonId: string) {
    const Updated = await this.courseModel
      .updateOne(
        { 'Lessons._id': LessonId },
        {
          $set: {
            'Lessons.$.Title': dto.Title,
            'Lessons.$.ReadingTime': dto.ReadingTime,
            'Lessons.$.Description': dto.Description,
            'Lessons.$.Video': dto.Video,
          },
        },
      )
      .exec();
    return Updated;
  }

  async EditLesson(
    dto: { Title: string; ReadingTime: string; Description: string },
    LessonId: string,
  ) {
    const Updated = await this.courseModel
      .updateOne(
        { 'Lessons._id': LessonId },
        {
          $set: {
            'Lessons.$.Title': dto.Title,
            'Lessons.$.ReadingTime': dto.ReadingTime,
            'Lessons.$.Description': dto.Description,
          },
        },
      )
      .exec();
    return Updated;
  }

  async DeleteLesson(LessonId: string) {
    const Updated = await this.courseModel
      .updateOne(
        { 'Lessons._id': LessonId },
        { $pull: { Lessons: { _id: LessonId } } },
      )
      .exec();
    return Updated;
  }

  async GetExam(CourseId: string): Promise<any> {
    const Course = await this.courseModel.findOne({ _id: CourseId });

    return { Exam: Course.Exam, Title: Course.Title };
  }

  async EditExam(dto: EditExamDto, CourseId: string) {
    const Update = await this.courseModel.updateOne(
      { _id: CourseId },
      { $set: { Exam: dto } },
    );
    return Update;
  }

  async FinishExam(CourseId: string, RequesterId: string) {
    const Update = await this.courseModel.updateOne(
      { _id: CourseId },
      { $push: { Passed: { Admin: RequesterId, PassedAt: new Date() } } },
    );

    return Update;
  }

  async GetExamResult(CourseId: string, RequesterId: string): Promise<any> {
    const Course = await this.courseModel.findOne({ _id: CourseId });

    var data = {
      IsPassed: false,
      Score: Course.Exam.Questions.length,
    };

    if (Course.Passed.some((item) => item.Admin == (RequesterId as any))) {
      data.IsPassed = true;
    } else {
      data.IsPassed = false;
    }

    return data;
  }

  async GetCertificate(CourseId: string, RequesterId: string): Promise<any> {
    const Course = await this.courseModel
      .findOne({ _id: CourseId })
      .select('Passed Title')
      .populate({ path: 'Passed.Admin', select: '_id Name' });
    var data = {};

    if (Course.Passed.some((item) => item.Admin._id == (RequesterId as any))) {
      let Pass = Course.Passed.find(
        (item) => item.Admin._id == (RequesterId as any),
      );
      data = {
        IsPassed: true,
        Name: Course.Title,
        Admin: Pass.Admin.Name,
        PassedAt: Pass.PassedAt,
      };
    } else {
      data = {
        IsPassed: false,
      };
    }
    return data;
  }
}
