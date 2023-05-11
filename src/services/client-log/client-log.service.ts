import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ClientLog, ClientLogDocument } from 'src/schemas/ClientLog.schema';
import { AdminsService } from '../admins/admins.service';
import { CreateLogDto } from './dto/CreateLog.dto';

@Injectable()
export class ClientLogService {
  constructor(
    @InjectModel(ClientLog.name)
    private clientLogModel: Model<ClientLogDocument>,
    @Inject(forwardRef(() => AdminsService))
    private readonly adminsService: AdminsService,
  ) {}

  async Create(dto: CreateLogDto, Admin: string) {
    const addLog = new this.clientLogModel({
      ...dto,
      Admin,
      CreatedAt: new Date(),
    });
    return addLog.save();
  }

  async GetList(LogFilterQuery: FilterQuery<ClientLog>, limit: number | null) {
    if (limit) {
      var Logs = this.clientLogModel
        .find({ LogFilterQuery }, { sort: { CreatedAt: -1 } })
        .select('Change Type _id CreatedAt')
        .limit(limit)
        .populate([
          { path: 'Admin', select: 'Name _id Avatar' },
          { path: 'Client', select: 'Name _id Pronouns' },
        ]);
    } else {
      var Logs = this.clientLogModel
        .find({ ...LogFilterQuery }, { sort: { CreatedAt: -1 } })
        .select('Change Type _id CreatedAt')
        .populate([
          { path: 'Admin', select: 'Name _id Avatar' },
          { path: 'Client', select: 'Name _id Pronouns' },
        ]);
    }

    return Logs;
  }

  async GetListWithPermissionApplied(
    LogFilterQuery: FilterQuery<ClientLog>,
    limit: number | null,
    RequesterId: string,
  ) {
    const Permissions = await this.adminsService.GetAdminPermissions(
      RequesterId,
    );

    if (Permissions.View.includes('update')) {
      return this.clientLogModel
        .find({ LogFilterQuery }, { sort: { CreatedAt: -1 } })
        .select('Change Type _id CreatedAt')
        .limit(limit ? limit : 0)
        .populate([
          { path: 'Admin', select: 'Name _id Avatar' },
          { path: 'Client', select: 'Name _id Pronouns' },
        ]);
    } else if (Permissions.View.includes('update-all')) {
      return this.clientLogModel
        .find({}, { sort: { CreatedAt: -1 } })
        .select('Change Type _id CreatedAt')
        .limit(limit ? limit : 0)
        .populate([
          { path: 'Admin', select: 'Name _id Avatar' },
          { path: 'Client', select: 'Name _id Pronouns' },
        ]);
    } else {
      throw new UnauthorizedException(
        'You have Not Right Privileges to access updates List',
      );
    }
  }

  async DeleteWithClientID(ClientId: string) {
    const remove = await this.clientLogModel.deleteMany({ Client: ClientId });
    return remove;
  }
}
