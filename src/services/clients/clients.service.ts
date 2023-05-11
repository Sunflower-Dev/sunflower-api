import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocumet } from 'src/schemas/client.schema';
import CreateDocx from 'src/Utils/CreateDocx';
import { AdminsService } from '../admins/admins.service';
import { ClientLogService } from '../client-log/client-log.service';
import { NotesService } from '../notes/notes.service';
import { SchedulesService } from '../schedules/schedules.service';
import { addDocumentClientDto } from './dto/addDocument-client-dto';
import { AddReportDto } from './dto/AddReport-dto';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocumet>,
    @Inject(forwardRef(() => AdminsService))
    private readonly adminService: AdminsService,
    private readonly scheduleService: SchedulesService,
    private readonly notesService: NotesService,
    private readonly clientLogService: ClientLogService,
  ) { }
  async create(createClientDto: CreateClientDto): Promise<Client> {
    var { staffs, BirthDate, ...ClientData } = createClientDto;
    var Y: number, M: number, D: number;

    Y = parseInt(BirthDate.split(/-/g)[0]);
    M = parseInt(BirthDate.split(/-/g)[1]) - 1;
    D = parseInt(BirthDate.split(/-/g)[2]);

    const CreateClient = new this.clientModel({
      ...ClientData,
      CreatedAt: new Date(),
      BirthDate: new Date(Y, M, D),
      Avatar: '/Uploads/Admin/profile-placeholder.svg',
      Admins: staffs,
    });
    const Created = await CreateClient.save();
    const ClientId = Created._id;

    await this.adminService.AddClient({ _id: { $in: staffs } }, ClientId);

    return Created;
  }

  async GetClientList(RequesterId: string) {
    var Query = {};
    if (RequesterId) {
      const AdminPermissions = await this.adminService.GetAdminPermissions(
        RequesterId,
      );

      if (AdminPermissions.View.includes('client-all')) {
        Query = {};
      } else {
        if (AdminPermissions.View.includes('client')) {
          Query = { Admins: { $in: RequesterId } };
        } else {
          throw new UnauthorizedException(
            'You have Not Right Privileges to access Clients List',
          );
        }
      }
    }

    const ClientList = await this.clientModel
      .find(Query)
      .populate({ path: 'Admins', select: 'Name _id' })
      .select('_id Name CreatedAt Status Avatar Admins');

    // this.adminService.GetAdminsCustom({ Clients_IDs: {} });

    return ClientList;
  }
  async GetClientsCount(): Promise<number> {
    const ClientList = await this.clientModel.find({});
    return ClientList.length;
  }

  async findOne(id: string, RequesterId: string) {
    const AdminPermissions = await this.adminService.GetAdminPermissions(
      RequesterId,
    );

    const Client = await this.clientModel.findOne({ _id: id }).populate([
      { path: 'Admins', select: 'Name _id Avatar' },
      { path: 'Documents.Uploader', select: 'Name _id Avatar' },
      { path: 'Reports.Reporter', select: 'Name _id' },
      { path: 'Medications.Admin', select: 'Name _id' },
    ]);
    const Schedules = await this.scheduleService.GetWithFilter({
      ClientID: id,
    });
    const Logs = await this.clientLogService.GetList({ Client: id }, null);

    if (AdminPermissions.View.includes('client-note')) {
      const Notes = await this.notesService.getNotes({ Client: id });
      return { Client, Schedules, Notes, Logs };
    } else {
      return { Client, Schedules, Logs };
    }
  }

  async removeAdminFromClient(ClientID: string, AdminID: string) {
    this.clientModel
      .updateOne({ _id: ClientID }, { $pull: { Admins: AdminID } })
      .exec();
  }

  async AddAdminToClient(ClientID: string, AdminID: string) {
    return this.clientModel.updateMany(
      { _id: ClientID },
      {
        $push: { Admins: AdminID },
      },
    );
  }

  async AddDocumentToClient(dto: addDocumentClientDto, id: string) {
    const update = this.clientModel
      .updateOne(
        { _id: id },
        {
          $push: { Documents: dto },
        },
      )
      .exec();

    const log = await this.clientLogService.Create(
      { Type: 'ADD', Change: 'a new Document', Client: id },
      dto.Uploader,
    );

    return update;
  }

  async remove(id: string) {
    const RemoveFromAdmin = await this.adminService.DeleteClientFromAllAdmins(
      id,
    );
    const RemoveLogs = await this.clientLogService.DeleteWithClientID(id);
    const RemoveNotes = await this.notesService.DeleteWithClientID(id);
    const RemoveSchedules = await this.scheduleService.DeleteWithClientID(id);

    const removeQ = await this.clientModel.deleteOne({ _id: id });

    return removeQ;
  }

  async GetClientForEdit(id: string) {
    const Client = await this.clientModel
      .findOne({ _id: id })
      .populate([{ path: 'Admins', select: 'Name _id' }]);
    const Admins = await this.adminService.GetList(null);

    return { Client, Admins };
  }

  async EditClient(dto: CreateClientDto, id: string, AdminID: string) {
    var { staffs, BirthDate, ...ClientData } = dto;
    var Y: number, M: number, D: number;

    Y = parseInt(BirthDate.split(/-/g)[0]);
    M = parseInt(BirthDate.split(/-/g)[1]) - 1;
    D = parseInt(BirthDate.split(/-/g)[2]);

    const Client = await this.clientModel.findOne({ _id: id });
    var UpdatingStaff = [];
    staffs.forEach((item) => {
      if (!Client.Admins.includes(item as any)) {
        UpdatingStaff.push(item);
      }
    });

    const Update = await this.clientModel
      .updateOne(
        { _id: id },
        {
          $set: {
            ...ClientData,
            BirthDate: new Date(Y, M, D),
            Admins: staffs,
          },
        },
      )
      .exec();

    await this.adminService.AddClient({ _id: { $in: UpdatingStaff } }, id);

    const log = await this.clientLogService.Create(
      { Type: 'EDIT', Change: 'Profile', Client: id },
      AdminID,
    );

    return Update;
  }

  async ChangeAvatar(Avatar: string, id: string, AdminID: string) {
    const Update = await this.clientModel
      .updateOne({ _id: id }, { $set: { Avatar: Avatar } })
      .exec();
    const log = await this.clientLogService.Create(
      { Type: 'EDIT', Change: 'Profile Image', Client: id },
      AdminID,
    );
    return { Avatar };
  }

  async AddReport(
    dto: AddReportDto,
    Reporter: string,
    Signature: string,
    clientId: string,
  ) {
    dto.NotifiedPerson.forEach((element) => {
      element.NotifiedTime = new Date(element.NotifiedTime);
    });

    dto.NotifiedPerson = dto.NotifiedPerson.filter(
      (item) => item.Name.length > 1,
    );
    dto.AffectedPerson = dto.AffectedPerson.filter(
      (item) => item.Name.length > 1,
    );
    dto.IncidentDate = new Date(dto.IncidentDate);

    const Add = await this.clientModel.updateOne(
      { _id: clientId },
      {
        $push: {
          Reports: {
            ...dto,
            CreatedAt: new Date(),
            Reporter: Reporter,
            Signature: Signature,
          },
        },
      },
    );
    const Admin = await this.adminService.FindOne(
      { _id: Reporter },
      '_id Name',
    );
    CreateDocx(dto, Admin.Admin.Name, new Date());

    return Add;
  }

  async GetReportById(ReportId: string): Promise<any> {
    const Report = await this.clientModel
      .findOne({ 'Reports._id': ReportId })
      .populate([{ path: 'Reports.Reporter', select: 'Name _id Avatar' }])
      .select('Reports.$');

    return Report.Reports[0];
  }

  async RequestDeleteDocument(
    DocumentId: string,
    Reason: string,
    RequesterId: string,
  ) {
    const update = await this.clientModel
      .updateOne(
        { 'Documents._id': DocumentId },
        {
          $push: {
            'Documents.$.DeleteRequest': {
              CreatedAt: new Date(),
              Reason,
              Admin: RequesterId,
            },
          },
          $set: { 'Documents.$.Status': 'PENDING' },
        },
      )
      .exec();

    // const log = await this.clientLogService.Create(
    //   { Type: 'ADD', Change: 'a new Document', Client: id },
    //   dto.Uploader,
    // );

    return update;
  }

  async GetDocumentRequests(DocumentId: string): Promise<any> {
    const Documents = await this.clientModel
      .findOne({ 'Documents._id': DocumentId })
      .populate([
        { path: 'Documents.DeleteRequest.Admin', select: 'Name _id Avatar' },
      ])
      .select('Documents.$');

    return Documents.Documents[0].DeleteRequest;
  }

  async DeleteDocumentConfirm(DocumentId: string) {
    const Documents = await this.clientModel
      .findOne({ 'Documents._id': DocumentId })
      .select('Documents.$');

    var fs = require('fs');
    var path = '../public' + Documents.Documents[0].File;
    try {
      await fs.unlinkSync(path);
    } catch (err) {
      console.error(err);
    }

    const Update = await this.clientModel.updateOne(
      { 'Documents._id': DocumentId },
      { $pull: { Documents: { _id: DocumentId } } },
    );

    return Update;
  }

  async AddMedicine(
    ClientId: string,
    AdminId: string,
    body: { Title: string; Pills: { Medication: string; Number: string }[] },
  ) {
    const Update = await this.clientModel.updateOne(
      { _id: ClientId },
      {
        $push: {
          Medications: { ...body, Admin: AdminId, CreatedAt: new Date() },
        },
      },
    );

    return Update;
  }

  async DeleteMedicine(ClientId: string, MedicineId: string) {
    const Update = await this.clientModel.updateOne(
      { _id: ClientId },
      { $pull: { Medications: { _id: MedicineId } } },
    );

    return Update;
  }
}
