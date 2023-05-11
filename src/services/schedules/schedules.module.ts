import { forwardRef, Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { schedulesController } from './schedules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedule, ScheduleSchema } from 'src/schemas/Schedule.schema';
import { TasksModule } from '../tasks/tasks.module';
import { ClientsModule } from '../clients/clients.module';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
    forwardRef(() => ClientsModule),
    TasksModule,
    forwardRef(() => AdminsModule),
  ],
  controllers: [schedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
