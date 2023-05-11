import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  OnlineOffice,
  OnlineOfficeDocument,
} from 'src/schemas/OnlineOffice.schema';
import { AdminsService } from '../admins/admins.service';
import { addDocumentClientDto } from '../clients/dto/addDocument-client-dto';

@Injectable()
export class OnlineOfficeService {
  constructor(
    @InjectModel(OnlineOffice.name)
    private onlineOfficeModel: Model<OnlineOfficeDocument>,
    private readonly adminsService: AdminsService,
  ) { }

  async findAll(RequesterId: string) {
    let Admins = await this.adminsService.GetOnlineOfficeAccessed();
    Admins = Admins.filter((item) => item._id.toString() !== RequesterId);

    const OnlineOffice = await this.onlineOfficeModel.findOne().populate([
      { path: 'Documents.Uploader', select: 'Name _id Avatar' },
      { path: 'Notes.Admin', select: 'Name _id Avatar' },
    ]);
    return { Admins, OnlineOffice };
  }

  async AddDocument(dto: addDocumentClientDto) {
    const update = await this.onlineOfficeModel
      .updateOne({}, { $push: { Documents: dto } })
      .exec();
    return update;
  }

  async AddNote(dto: { Title: string; Description: string }, AdminId: string) {
    const update = await this.onlineOfficeModel
      .updateOne(
        {},
        { $push: { Notes: { ...dto, CreatedAt: new Date(), Admin: AdminId } } },
      )
      .exec();
    return update;
  }

  async EditNote(dto: { Title: string; Description: string }, NoteID: string) {
    const update = await this.onlineOfficeModel
      .updateOne(
        { 'Notes._id': NoteID },
        {
          $set: {
            'Notes.$.Title': dto.Title,
            'Notes.$.Description': dto.Description,
          },
        },
      )
      .exec();
    return update;
  }

  async AddService(dto: { Title: string; Description: string }) {
    const update = await this.onlineOfficeModel
      .updateOne(
        {},
        { $push: { Services: { ...dto, CreatedAt: new Date(), Folders: [] } } },
      )
      .exec();
    return update;
  }

  async GetService(id: string): Promise<any> {
    const Service = await this.onlineOfficeModel
      .findOne({
        'Services._id': id,
      })
      .select('Services.$').populate([
        { path: 'Services.Folders.Documents.Uploader', select: 'Name _id Avatar' },
      ]);;
    return Service.Services[0];
  }

  async AddFolder(dto: { Title: string }, ServiceId: string) {
    const update = await this.onlineOfficeModel
      .updateOne(
        { 'Services._id': ServiceId },
        { $push: { 'Services.$.Folders': { ...dto, Documents: [] } } },
      )
      .exec();
    return update;
  }

  async AddDocumentToFolder(
    dto: addDocumentClientDto,
    ServiceId: string,
    FolderID: string,
  ) {
    const update = await this.onlineOfficeModel
      .updateOne(
        { 'Services.Folders._id': FolderID },
        {
          $push: {
            'Services.$[service].Folders.$[folder].Documents': dto,
          },
        },
        {
          arrayFilters: [
            { 'service._id': ServiceId },
            { 'folder._id': FolderID },
          ],
        },
      )
      .exec();
    return update;
  }

  async EditService(dto: { Title: string; Description: string }, id: string) {
    const update = await this.onlineOfficeModel
      .updateOne(
        { 'Services._id': id },
        {
          $set: {
            'Services.$.Title': dto.Title,
            'Services.$.Description': dto.Description,
          },
        },
      )
      .exec();
    return update;
  }

  async DeleteService(id: string) {
    const update = await this.onlineOfficeModel
      .updateOne({}, { $pull: { Services: { _id: id } } })
      .exec();
    return update;
  }

  async EditFolder(
    dto: { Title: string },
    ServiceId: string,
    FolderId: string,
  ) {
    const update = await this.onlineOfficeModel
      .updateOne(
        { 'Services.Folders._id': FolderId },
        {
          $set: {
            'Services.$[service].Folders.$[folder].Title': dto.Title,
          },
        },
        {
          arrayFilters: [
            { 'service._id': ServiceId },
            { 'folder._id': FolderId },
          ],
        },
      )
      .exec();
    return update;
  }

  async DeleteFolder(ServiceId: string, id: string) {
    const update = await this.onlineOfficeModel
      .updateOne(
        {},
        {
          $pull: {
            'Services.$[service].Folders': { _id: id },
          },
        },
        {
          arrayFilters: [{ 'service._id': ServiceId }],
        },
      )
      .exec();
    return update;
  }

  async RequestDeleteDocument(
    DocumentId: string,
    Reason: string,
    RequesterId: string,
  ) {
    const update = await this.onlineOfficeModel
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
    return update;
  }

  async RequestDeleteDocumentFromService(
    ServiceId: string,
    folderId: string,
    DocumentId: string,
    Reason: string,
    RequesterId: string,
  ) {
    const update = await this.onlineOfficeModel
      .updateOne(
        { 'Services.Folders.Documents._id': DocumentId },
        {
          $push: {
            'Services.$[service].Folders.$[folder].Documents.$[document].DeleteRequest':
            {
              CreatedAt: new Date(),
              Reason,
              Admin: RequesterId,
            },
          },
          $set: {
            'Services.$[service].Folders.$[folder].Documents.$[document].Status':
              'PENDING',
          },
        },
        {
          arrayFilters: [
            { 'service._id': ServiceId },
            { 'folder._id': folderId },
            { 'document._id': DocumentId },
          ],
        },
      )
      .exec();
    return update;
  }

  async GetDocumentRequests(DocumentId: string): Promise<any> {
    const Documents = await this.onlineOfficeModel
      .findOne({ 'Documents._id': DocumentId })
      .populate([
        { path: 'Documents.DeleteRequest.Admin', select: 'Name _id Avatar' },
      ])
      .select('Documents.$');

    return Documents.Documents[0].DeleteRequest;
  }

  async GetNoteById(NoteId: string): Promise<any> {
    const Note = await this.onlineOfficeModel
      .findOne({ 'Notes._id': NoteId })
      .populate([{ path: 'Notes.Admin', select: 'Name _id Avatar' }])
      .select('Notes.$');
    return Note.Notes[0];
  }

  async DeleteDocumentConfirm(DocumentId: string) {
    const Documents = await this.onlineOfficeModel
      .findOne({ 'Documents._id': DocumentId })
      .select('Documents.$');

    var fs = require('fs');
    var path = '../public' + Documents.Documents[0].File;
    try {
      await fs.unlinkSync(path);
    } catch (err) {
      console.error(err);
    }

    const Update = await this.onlineOfficeModel.updateOne(
      { 'Documents._id': DocumentId },
      { $pull: { Documents: { _id: DocumentId } } },
    );

    return Update;
  }

  async GetDocumentRequestsFromService(
    ServiceId: string,
    folderId: string,
    DocumentId: string,
  ): Promise<any> {
    const Services = await this.onlineOfficeModel
      .findOne({
        'Services.Folders.Documents': { $elemMatch: { _id: DocumentId } },
      })
      .populate([
        {
          path: 'Services.Folders.Documents.Uploader',
          select: 'Name _id Avatar',
        },
        {
          path: 'Services.Folders.Documents.DeleteRequest.Admin',
          select: 'Name _id Avatar',
        },
      ])
      .select('Services.$')
      .exec();

    const folders = JSON.stringify(Services.Services[0].Folders);
    var folder = JSON.parse(folders).find((item) => item._id === folderId);
    var DeleteRequest = folder.Documents.find(
      (item) => item._id === DocumentId,
    ).DeleteRequest;

    return DeleteRequest;
  }

  async DeleteDocumentConfirmFromService(
    ServiceId: string,
    folderId: string,
    DocumentId: string,
  ) {
    const Services = await this.onlineOfficeModel
      .findOne({
        'Services.Folders.Documents': { $elemMatch: { _id: DocumentId } },
      })
      .populate([
        {
          path: 'Services.Folders.Documents.Uploader',
          select: 'Name _id Avatar',
        },
        {
          path: 'Services.Folders.Documents.DeleteRequest.Admin',
          select: 'Name _id Avatar',
        },
      ])
      .select('Services.$')
      .exec();

    const folders = JSON.stringify(Services.Services[0].Folders);
    var folder = JSON.parse(folders).find((item) => item._id === folderId);
    var File = folder.Documents.find((item) => item._id === DocumentId).File;

    var fs = require('fs');
    var path = '../public' + File;
    try {
      await fs.unlinkSync(path);
    } catch (err) {
      console.error(err);
    }

    const Update = await this.onlineOfficeModel.updateOne(
      { 'Services.Folders': { $elemMatch: { _id: folderId } } },
      {
        $pull: {
          'Services.$[service].Folders.$[folder].Documents': {
            _id: DocumentId,
          },
        },
      },
      {
        arrayFilters: [
          { 'service._id': ServiceId },
          { 'folder._id': folderId },
        ],
      },
    );

    return Update;
  }
}
