import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoursesService } from './courses.service';
import { ChangeCourseOrderDto } from './dto/ChangeCourseOrder.dto';
import { CreateCourseDto } from './dto/CreateCourse.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EditExamDto } from './dto/EditExam.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async GetCourseAPI(@Request() req: any) {
    const CourseList = await this.coursesService.GetCourseAPI();
    return { CourseList, id: req.user.sub };
  }

  @Get('GetExamDescription/:CourseId')
  async GetExamDescription(
    @Param('CourseId') CourseId: string,
    @Request() req: any,
  ) {
    const CourseList = await this.coursesService.GetExamDescription(
      CourseId,
      req.user.sub,
    );
    return CourseList;
  }

  @Post('/AddCourse')
  async CreateCourse(@Body() dto: CreateCourseDto) {
    return this.coursesService.CreateCourse(dto.Title);
  }

  @Post('AddLessonWithFile/:CourseId')
  @UseInterceptors(
    FileInterceptor('File', {
      storage: diskStorage({
        destination: '../public/Uploads/Course',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  async AddLessonWithFile(
    @UploadedFile() File: Express.Multer.File,
    @Body() body: any,
    @Param('CourseId') CourseId: string,
  ) {
    return this.coursesService.CreateLesson(
      {
        Video: '/Uploads/Course/' + File.filename,
        Description: body.Description,
        ReadingTime: body.Time,
        Title: body.Title,
      },
      CourseId,
    );
  }

  @Post('AddLesson/:CourseId')
  async AddLesson(@Body() body: any, @Param('CourseId') CourseId: string) {
    console.log('this');

    return this.coursesService.CreateLesson(
      {
        Video: 'NONE',
        Description: body.Description,
        ReadingTime: body.Time,
        Title: body.Title,
      },
      CourseId,
    );
  }

  @Put('EditCourse/:CourseId')
  async EditCourse(
    @Body() dto: CreateCourseDto,
    @Param('CourseId') CourseId: string,
  ) {
    return this.coursesService.EditCourse(dto, CourseId);
  }

  @Put('EditLesson/:id')
  async EditLesson(@Body() body: any, @Param('id') LessonId: string) {
    return this.coursesService.EditLesson(
      {
        Description: body.Description,
        ReadingTime: body.Time,
        Title: body.Title,
      },
      LessonId,
    );
  }

  @Delete('DeleteLesson/:id')
  async DeleteLesson(@Param('id') LessonId: string) {
    return this.coursesService.DeleteLesson(LessonId);
  }

  @Put('EditLessonWithFile/:id')
  @UseInterceptors(
    FileInterceptor('File', {
      storage: diskStorage({
        destination: '../public/Uploads/Course',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  async EditLessonWithFile(
    @UploadedFile() File: Express.Multer.File,
    @Body() body: any,
    @Param('id') LessonId: string,
  ) {
    return this.coursesService.EditLessonWithVideo(
      {
        Video: '/Uploads/Course/' + File.filename,
        Description: body.Description,
        ReadingTime: body.Time,
        Title: body.Title,
      },
      LessonId,
    );
  }

  @Put('ChangeCourseOrder')
  async ChangeCourseOrder(@Body() dto: ChangeCourseOrderDto[]) {
    return this.coursesService.ChangeCourseOrder(dto);
  }

  @Put('ChangeLessonOrder/:CourseId')
  async ChangeLessonOrder(
    @Param('CourseId') CourseId: string,
    @Body() dto: ChangeCourseOrderDto[],
  ) {
    return this.coursesService.ChangeLessonOrder(dto, CourseId);
  }

  @Put('PassLesson/:LessonId')
  async PassLesson(@Param('LessonId') LessonId: string, @Request() req: any) {
    return this.coursesService.PassLesson(LessonId, req.user.sub);
  }

  @Get('GetCourseList')
  async GetCourseList() {
    return this.coursesService.GetCourseList();
  }
  @Get('GetCourseItem/:id')
  async GetCourseItem(@Param('id') id: string) {
    return this.coursesService.GetCourseItem(id);
  }

  @Get('GetLesson/:LessonId')
  async GetLesson(@Param('LessonId') LessonId: string, @Request() req: any) {
    return this.coursesService.GetLesson(LessonId, req.user.sub);
  }

  @Get('GetExam/:CourseId')
  async GetExam(@Param('CourseId') CourseId: string) {
    return this.coursesService.GetExam(CourseId);
  }

  @Put('EditExam/:CourseId')
  async EditExam(
    @Param('CourseId') CourseId: string,
    @Body() dto: EditExamDto,
  ) {
    return this.coursesService.EditExam(dto, CourseId);
  }

  @Put('FinishExam/:CourseId')
  async FinishExam(@Param('CourseId') CourseId: string, @Request() req: any) {
    return this.coursesService.FinishExam(CourseId, req.user.sub);
  }
  @Get('GetExamResult/:CourseId')
  async GetExamResult(
    @Param('CourseId') CourseId: string,
    @Request() req: any,
  ) {
    return this.coursesService.GetExamResult(CourseId, req.user.sub);
  }
  @Get('GetCertificate/:CourseId')
  async GetCertificate(
    @Param('CourseId') CourseId: string,
    @Request() req: any,
  ) {
    return this.coursesService.GetCertificate(CourseId, req.user.sub);
  }
}
