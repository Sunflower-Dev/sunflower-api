import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Note, NoteDocument } from 'src/schemas/Note.schema';
import { ClientLogService } from '../client-log/client-log.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private readonly clientLogService: ClientLogService,
  ) {}

  async create(dto: CreateNoteDto, AdminID: string): Promise<Note> {
    const CreateNote = new this.noteModel({
      ...dto,
      CreatedAt: new Date(),
      Admin: AdminID,
    });
    const log = await this.clientLogService.Create(
      { Type: 'ADD', Change: 'a new Note', Client: dto.Client },
      AdminID,
    );
    return CreateNote.save();
  }

  async getNotes(notesFilterQuery: FilterQuery<Note>) {
    return this.noteModel.find(notesFilterQuery).populate([
      { path: 'Admin', select: 'Name _id Avatar' },
      { path: 'Client', select: 'Name _id' },
    ]);
  }
  async getNoteById(NoteID: string) {
    const Note = await this.noteModel
      .findOne({ _id: NoteID })
      .populate([{ path: 'Admin', select: 'Name _id Avatar' }]);

    return Note;
  }

  async EditNote(
    noteFilterQuery: FilterQuery<Note>,
    Updatingdata: UpdateNoteDto,
    AdminID: string,
  ) {
    const { ClientID, ...data } = Updatingdata;
    const update = await this.noteModel
      .updateMany(noteFilterQuery, data)
      .exec();

    const log = await this.clientLogService.Create(
      { Type: 'EDIT', Change: 'Notes', Client: ClientID },
      AdminID,
    );

    return update;
  }

  async DeleteWithClientID(ClientId: string) {
    const remove = await this.noteModel.deleteMany({ Client: ClientId });
    return remove;
  }
}
