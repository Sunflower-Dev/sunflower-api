import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';

@UseGuards(AuthGuard('jwt'))
@Controller('Notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}
  @Post()
  async NewNote(@Body() dto: CreateNoteDto, @Request() req: any) {
    return this.notesService.create(dto, req.user.sub);
  }

  @Put(':id')
  async EditNote(
    @Body() dto: UpdateNoteDto,
    @Param() param: { id: string },
    @Request() req: any,
  ) {
    return this.notesService.EditNote({ _id: param.id }, dto, req.user.sub);
  }

  @Get('/:id')
  async GetNoteByID(@Param('id') id: string) {
    return this.notesService.getNoteById(id);
  }

  @Get('/Get')
  async GetByClientID() {}
}
