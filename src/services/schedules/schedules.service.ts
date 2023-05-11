import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Schedule, ScheduleDocument } from 'src/schemas/Schedule.schema';
import { AdminsService } from '../admins/admins.service';
import { ClientsService } from '../clients/clients.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,
    private readonly tasksService: TasksService,
    @Inject(forwardRef(() => AdminsService))
    private readonly adminsService: AdminsService,
  ) {}

  async create(dto: CreateScheduleDto, Assigner: string): Promise<Schedule> {
    var { ScheduleDate, ScheduleTime, ...schedule } = dto;
    var Y: number, M: number, D: number, h: number, m: number;

    Y = parseInt(ScheduleDate.split(/-/g)[0]);
    M = parseInt(ScheduleDate.split(/-/g)[1]) - 1;
    D = parseInt(ScheduleDate.split(/-/g)[2]);
    h = parseInt(ScheduleTime.split(/:/g)[0]);
    m = parseInt(ScheduleTime.split(/:/g)[1]);

    const CreateSchedule = new this.scheduleModel({
      ...schedule,
      CreatedAt: new Date(),
      ScheduleDate: new Date(Y, M, D, h, m, 0, 0),
      Status: 'IDLE',
    });

    const Client = (await this.clientsService.findOne(dto.ClientID, Assigner))
      .Client;

    const taskcreate = await this.tasksService.create(
      {
        ExpireDate: ScheduleDate + ' ' + ScheduleTime,
        To: dto.AdminID,
        Title:
          (dto.Type === 'MEET' ? 'Metting with' : 'Call') +
          (Client.Pronouns === 'She' ? ' Ms' : ' Mr') +
          '.' +
          Client.Name +
          ' at ' +
          Y +
          '/' +
          M +
          '/' +
          D +
          ' ' +
          h +
          ':' +
          m,
      },
      Assigner,
    );

    return CreateSchedule.save();
  }

  async GetAll(RequesterId: string) {
    const AdminPermissions = await this.adminsService.GetAdminPermissions(
      RequesterId,
    );

    if (AdminPermissions.View.includes('calender-all')) {
      return this.scheduleModel.find().populate([
        { path: 'AdminID', select: '_id Name' },
        { path: 'ClientID', select: '_id Name' },
      ]);
    } else if (AdminPermissions.View.includes('calender')) {
      return this.scheduleModel.find({ AdminID: RequesterId }).populate([
        { path: 'AdminID', select: '_id Name' },
        { path: 'ClientID', select: '_id Name' },
      ]);
    } else {
      throw new UnauthorizedException(
        'You have Not Right Privileges to access calender',
      );
    }
  }

  async GetById(id: string): Promise<Schedule> {
    return this.scheduleModel.findById(id).populate([
      { path: 'AdminID', select: '_id Name' },
      { path: 'ClientID', select: '_id Name' },
    ]);
  }

  async Edit(id: string, dto: CreateScheduleDto): Promise<any> {
    var { ScheduleDate, ScheduleTime, ...schedule } = dto;
    var Y: number, M: number, D: number, h: number, m: number;

    Y = parseInt(ScheduleDate.split(/-/g)[0]);
    M = parseInt(ScheduleDate.split(/-/g)[1]) - 1;
    D = parseInt(ScheduleDate.split(/-/g)[2]);
    h = parseInt(ScheduleTime.split(/:/g)[0]);
    m = parseInt(ScheduleTime.split(/:/g)[1]);

    const EditSchedule = this.scheduleModel.updateOne(
      { _id: id },
      {
        ...schedule,
        ScheduleDate: new Date(Y, M, D, h, m, 0, 0),
      },
    );
    return EditSchedule.exec();
  }

  async RemoveSchedule(id: string) {
    return this.scheduleModel.deleteOne({ _id: id }).exec();
  }

  async CancelSchedule(id: string) {
    return this.scheduleModel
      .updateOne({ _id: id }, { Status: 'CANCELED' })
      .exec();
  }

  async CompleteSchedule(id: string) {
    return this.scheduleModel.updateOne({ _id: id }, { Status: 'DONE' }).exec();
  }

  async GetWithFilter(scheduleFilterQuery: FilterQuery<Schedule>) {
    return this.scheduleModel
      .find(scheduleFilterQuery)
      .populate([
        { path: 'AdminID', select: 'Name _id' },
        { path: 'ClientID', select: 'Name _id' },
      ])
      .exec();
  }

  async DeleteWithClientID(ClientId: string) {
    const remove = await this.scheduleModel.deleteMany({ ClientID: ClientId });
    return remove;
  }

  async GetSchedulesCount(): Promise<number> {
    const List = await this.scheduleModel.find({ Status: 'DONE' });
    return List.length;
  }
}
