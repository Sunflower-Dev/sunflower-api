import { Injectable } from '@nestjs/common';
import { AdminsService } from '../admins/admins.service';
import { ClientLogService } from '../client-log/client-log.service';
import { ClientsService } from '../clients/clients.service';
import { SchedulesService } from '../schedules/schedules.service';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly tasksService: TasksService,
    private readonly scheduleService: SchedulesService,
    private readonly clientLogService: ClientLogService,
    private readonly clientsService: ClientsService,
    private readonly adminsService: AdminsService,
  ) {}

  async GetDashboard(RequesterId: string, Type: string) {
    var Schedules: any;
    try {
      Schedules = await this.scheduleService.GetAll(RequesterId);
    } catch (error) {
      Schedules = error;
    }

    const Tasks = await this.tasksService.getList({
      To: RequesterId,
      Status: 'IDLE',
    });

    const AdminType =
      RequesterId === '626c1952a2b26a3210e655be' || //Fatima Azimi Account
      RequesterId === '6210f33ae0d722c2ee2f2344' //Dev Account
        ? 'SuperAdmin'
        : 'Admin';

    var Data: any;
    if (Type !== 'Mobile') {
      var Logs: any;
      try {
        Logs = await this.clientLogService.GetListWithPermissionApplied(
          { Admin: RequesterId },
          15,
          RequesterId,
        );
      } catch (error) {
        Logs = error;
      }

      Data = { Schedules, Tasks, Logs, AdminType };
    } else {
      Data = { Schedules, Tasks, AdminType };
    }

    if (AdminType === 'SuperAdmin') {
      const Clients = await this.clientsService.GetClientsCount();
      const Admins = await this.adminsService.GetAdminsCount();
      const Schedules = await this.scheduleService.GetSchedulesCount();
      Data.SuperAdmin = { Clients, Admins, Schedules };
    }

    return Data;
  }
}
