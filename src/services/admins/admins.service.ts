import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Admin, AdminDocument } from '../../schemas/admin.schema';
import { AuthDto, CreateAdminDto } from './dto';
import { createHash } from 'crypto';
import { toBase64 } from 'js-base64';
import { AdminList } from './dto/AdminList.dto';
import { ClientsService } from '../clients/clients.service';
import { TasksService } from '../tasks/tasks.service';
import { ClientLogService } from '../client-log/client-log.service';
import { ChangePassword } from './dto/ChangePassword.dto';
import SendForgotPassEmail from 'src/Utils/ForgotPassEmail';

@Injectable()
export class AdminsService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @Inject(forwardRef(() => ClientsService))
    private clientService: ClientsService,
    private tasksService: TasksService,
    private readonly clientLogService: ClientLogService,
  ) {}

  async Login(dto: AuthDto) {
    //retrieve Admin
    const Admin = await this.adminModel.findOne({ Email: dto.Email });

    if (!Admin) throw new UnauthorizedException('Email Not Found');

    var hash = createHash('sha512').update(dto.Password).digest('hex');
    var hashedpassword = toBase64(hash);

    if (Admin.Password !== hashedpassword) {
      throw new UnauthorizedException('Password incorrect');
    }
    const { Name, Permissions, Avatar } = Admin;

    return {
      token: this.signAdmin(Admin._id, Admin.Email, 'admin'),
      _id: Admin._id,
      Name,
      Permissions,
      Avatar,
    };
  }

  private signAdmin(id: Number, email: string, type: string) {
    return this.jwtService.sign({
      sub: id,
      email,
      type: type,
    });
  }

  async create(admin: CreateAdminDto): Promise<Admin> {
    var hash = createHash('sha512').update('123456789').digest('hex');
    var hashedpassword = toBase64(hash);

    const { BirthDate, ...therest } = admin;
    var Y: number, M: number, D: number;

    Y = parseInt(admin.BirthDate.split(/-/g)[0]);
    M = parseInt(admin.BirthDate.split(/-/g)[1]) - 1;
    D = parseInt(admin.BirthDate.split(/-/g)[2]);

    const createdAdmin = new this.adminModel({
      ...therest,
      Password: hashedpassword,
      CreatedAt: new Date(),
      BirthDate: new Date(Y, M, D),
      Avatar: '/Uploads/Admin/profile-placeholder.svg',
    });
    return createdAdmin.save();
  }

  async GetList(requesterId: string): Promise<AdminList[]> {
    const Admins = this.adminModel
      .find({ _id: { $ne: requesterId } })
      .select('Name Avatar CreatedAt _id Clients_IDs')
      .populate({ path: 'Clients_IDs', select: '_id Name' });

    return Admins;
  }

  async GetAdminsCount(): Promise<number> {
    const AdminsList = await this.adminModel.find({});
    return AdminsList.length;
  }

  async FindOne(adminFilterQuery: FilterQuery<Admin>, select: string) {
    const Admin = await this.adminModel
      .findOne(adminFilterQuery)
      .populate({ path: 'Clients_IDs', select: '_id Name Avatar CreatedAt' })
      .select(select);
    const AvailableClients = await this.clientService.GetClientList(null);
    const Tasks = await this.tasksService.getList({
      To: adminFilterQuery._id,
      Status: 'IDLE',
    });
    const Logs = await this.clientLogService.GetList(
      { Admin: adminFilterQuery._id },
      null,
    );

    return { Admin, AvailableClients, Tasks, Logs };
  }

  async GetProfile(
    adminFilterQuery: FilterQuery<Admin>,
    select: string,
  ): Promise<any> {
    const Admin = await this.adminModel
      .findOne(adminFilterQuery)
      .populate({ path: 'Clients_IDs', select: '_id Name Avatar CreatedAt' })
      .select(select);

    const Tasks = await this.tasksService.getList({
      To: adminFilterQuery._id,
      Status: 'IDLE',
    });
    const Logs = await this.clientLogService.GetList(
      { Admin: adminFilterQuery._id },
      null,
    );

    return { Admin, Tasks, Logs };
  }

  async DeleteAdmin(adminFilterQuery: FilterQuery<Admin>) {
    return this.adminModel.deleteOne(adminFilterQuery);
  }

  async Update(admin: CreateAdminDto, adminFilterQuery: FilterQuery<Admin>) {
    const { BirthDate, ...therest } = admin;
    var Y: number, M: number, D: number;

    Y = parseInt(admin.BirthDate.split(/-/g)[0]);
    M = parseInt(admin.BirthDate.split(/-/g)[1]) - 1;
    D = parseInt(admin.BirthDate.split(/-/g)[2]);

    const createdAdmin = new this.adminModel({
      ...therest,
      BirthDate: new Date(Y, M, D),
    });
    return this.adminModel.updateOne(adminFilterQuery, createdAdmin);
  }

  async AddClient(adminFilterQuery: FilterQuery<Admin>, ClientID: string) {
    return this.adminModel.updateMany(adminFilterQuery, {
      $push: { Clients_IDs: ClientID },
    });
  }

  async AddClientFromAdmin(AdminID: string, ClientID: string) {
    const AddAdmin = await this.AddClient({ _id: AdminID }, ClientID);
    const AddToClient = await this.clientService.AddAdminToClient(
      ClientID,
      AdminID,
    );
    return { AddAdmin, AddToClient };
  }

  async GetAdminsCustom(
    adminFilterQuery: FilterQuery<Admin>,
    select?: string | undefined,
  ) {
    if (select) {
      return this.adminModel.find(adminFilterQuery, select);
    } else {
      return this.adminModel.find(adminFilterQuery);
    }
  }

  async DeleteClientFromAdmin(AdminID: string, ClientID: string) {
    const UpdateAdmin = this.adminModel
      .updateOne({ _id: AdminID }, { $pull: { Clients_IDs: ClientID } })
      .exec();
    const UpdateClient = await this.clientService.removeAdminFromClient(
      ClientID,
      AdminID,
    );
    return UpdateAdmin;
  }

  async DeleteClientFromAllAdmins(ClientID: string) {
    const Update = this.adminModel
      .updateMany({}, { $pull: { Clients_IDs: ClientID } })
      .exec();
    return Update;
  }

  async ChangePassword(dto: ChangePassword, user: any) {
    const Admin = await this.adminModel.findOne({ _id: user.sub });

    var CurrentHashed = toBase64(
      createHash('sha512').update(dto.CurrentPassword).digest('hex'),
    );
    if (Admin.Password === CurrentHashed) {
      var NewHashed = toBase64(
        createHash('sha512').update(dto.NewPassword).digest('hex'),
      );
      const updated = await this.adminModel
        .updateOne(
          { _id: user.sub },
          {
            $set: { Password: NewHashed },
          },
        )
        .exec();

      return {
        token: this.signAdmin(Admin._id, Admin.Email, 'admin'),
        _id: Admin._id,
        Name: Admin.Name,
        Permissions: Admin.Permissions,
        Avatar: Admin.Avatar,
      };
    } else {
      throw new UnauthorizedException('Password incorrect');
    }
  }

  async UpdatePermissions(AdminId: string, dto: any) {
    const { _id, ...data } = dto;
    const update = await this.adminModel.updateOne(
      { _id: AdminId },
      { $set: { Permissions: data } },
    );
    return update;
  }

  async GetOnlineOfficeAccessed() {
    const Admins = this.adminModel
      .find({ 'Permissions.View': 'online-office' })
      .select('Name Avatar _id');

    return Admins;
  }

  async GetAdminPermissions(AdminID: string): Promise<any> {
    const Admin = await this.adminModel.findOne({ _id: AdminID });
    return Admin.Permissions;
  }

  async ChangeAvatar(Avatar: string, id: string) {
    const Update = await this.adminModel
      .updateOne({ _id: id }, { $set: { Avatar: Avatar } })
      .exec();
    return { Avatar };
  }

  async SendRecoveryCode(Email: string) {
    const Admin = await this.adminModel.findOne({ Email: Email });
    if (Admin === null) {
      throw new NotFoundException('This email is not found!');
    } else {
      const Code = Math.floor(1000 + Math.random() * 9000);
      const Update = await this.adminModel.updateOne(
        { Email: Email },
        { $push: { RecoverCodes: { Code: Code, CreatedAt: new Date() } } },
      );
      await SendForgotPassEmail(Code, Admin.Name, Email);
    }
  }

  async VerifyRecoveryCode(body: { Email: string; Code: string }) {
    const Admin = await this.adminModel.findOne({ Email: body.Email });
    const RecoverCode = Admin.RecoverCodes[Admin.RecoverCodes.length - 1];

    if (parseInt(body.Code) === RecoverCode.Code) {
      return { Status: 'OK' };
    } else {
      throw new UnauthorizedException('Code entered is Wrong!');
    }
  }

  async NewPassword(body: { Email: string; Code: string; Password: string }) {
    const Admin = await this.adminModel.findOne({ Email: body.Email });
    const RecoverCode = Admin.RecoverCodes[Admin.RecoverCodes.length - 1];

    if (parseInt(body.Code) === RecoverCode.Code) {
      var hash = createHash('sha512').update(body.Password).digest('hex');
      var hashedpassword = toBase64(hash);

      const Update = await this.adminModel.updateOne(
        { Email: body.Email },
        { $set: { Password: hashedpassword } },
      );
      return Update;
    } else {
      throw new UnauthorizedException();
    }
  }
}
