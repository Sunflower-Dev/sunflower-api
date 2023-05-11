import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggerModule } from 'nestjs-pino';

import { AdminsModule } from './services/admins/admins.module';
import { ClientsModule } from './services/clients/clients.module';
import { SchedulesModule } from './services/schedules/schedules.module';
import { TasksModule } from './services/tasks/tasks.module';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './stategy/jwt.strategy';
import pino from 'pino';
import { NotesModule } from './services/notes/notes.module';
import { ChatModule } from './services/chat/chat.module';
import { ClientLogModule } from './services/client-log/client-log.module';
import { NotificationsModule } from './services/notifications/notifications.module';
import { CoursesModule } from './services/courses/courses.module';
import { OnlineOfficeModule } from './services/online-office/online-office.module';
import { DashboardModule } from './services/dashboard/dashboard.module';

var d = new Date();
var today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({ envFilePath: join(__dirname, '..', '.env') }),
    MongooseModule.forRoot(process.env.CONNECTION_STRING),
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: true,
        logger: pino(
          {},
          pino.destination(join(__dirname, '..', 'logs/' + today + '.log')),
        ),
      },
    }),
    AdminsModule,
    ClientsModule,
    SchedulesModule,
    NotesModule,
    TasksModule,
    ChatModule,
    ClientLogModule,
    NotificationsModule,
    CoursesModule,
    OnlineOfficeModule,
    DashboardModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LoggerMiddleware)
  //     .forRoutes({ path: '*', method: RequestMethod.ALL });
  // }
}
