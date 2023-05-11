import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SchedulesModule } from '../schedules/schedules.module';
import { TasksModule } from '../tasks/tasks.module';
import { ClientLogModule } from '../client-log/client-log.module';
import { ClientsModule } from '../clients/clients.module';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [
    SchedulesModule,
    TasksModule,
    ClientLogModule,
    ClientsModule,
    AdminsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
