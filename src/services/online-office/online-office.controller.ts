import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Put,
} from '@nestjs/common';
import { OnlineOfficeService } from './online-office.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(AuthGuard('jwt'))
@Controller('online-office')
export class OnlineOfficeController {
  constructor(private readonly onlineOfficeService: OnlineOfficeService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.onlineOfficeService.findAll(req.user.sub);
  }

  @Post('AddDocument')
  @UseInterceptors(
    FileInterceptor('File', {
      storage: diskStorage({
        destination: '../public/Uploads/OnlineOffice/Documents',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  AddDocument(
    @UploadedFile() File: Express.Multer.File,
    @Body() body: any,
    @Request() req: any,
  ) {
    return this.onlineOfficeService.AddDocument({
      CreatedAt: new Date(),
      Status: 'IDLE',
      Title: body.Title,
      Uploader: req.user.sub,
      File: '/Uploads/OnlineOffice/Documents/' + File.filename,
      Type: extname(File.filename).replace(/[.]/g, '').toUpperCase(),
    });
  }

  @Post('AddNote')
  async AddNote(
    @Body()
    dto: { Title: string; Description: string },
    @Request() req: any,
  ) {
    return this.onlineOfficeService.AddNote(dto, req.user.sub);
  }

  @Put('EditNote/:NoteID')
  async EditNote(
    @Body() dto: { Title: string; Description: string },
    @Param('NoteID') NoteID: string,
  ) {
    return this.onlineOfficeService.EditNote(dto, NoteID);
  }

  @Post('AddService')
  async AddService(@Body() dto: { Title: string; Description: string }) {
    return this.onlineOfficeService.AddService(dto);
  }

  @Get('GetService/:id')
  GetService(@Param('id') id: string) {
    return this.onlineOfficeService.GetService(id);
  }

  @Post('AddFolder/:ServiceId')
  async AddFolder(
    @Body() dto: { Title: string },
    @Param('ServiceId') ServiceId: string,
  ) {
    return this.onlineOfficeService.AddFolder(dto, ServiceId);
  }

  @Post('Services/AddDocument/:ServiceId/:FolderId')
  @UseInterceptors(
    FileInterceptor('File', {
      storage: diskStorage({
        destination: '../public/Uploads/OnlineOffice/Services/Documents',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  async AddDocumentToFolder(
    @UploadedFile() File: Express.Multer.File,
    @Body() body: any,
    @Request() req: any,
    @Param('ServiceId') ServiceId: string,
    @Param('FolderId') FolderId: string,
  ) {
    return this.onlineOfficeService.AddDocumentToFolder(
      {
        CreatedAt: new Date(),
        Status: 'IDLE',
        Title: body.Title,
        Uploader: req.user.sub,
        File: '/Uploads/OnlineOffice/Services/Documents/' + File.filename,
        Type: extname(File.filename).replace(/[.]/g, '').toUpperCase(),
      },
      ServiceId,
      FolderId,
    );
  }

  @Put('EditService/:id')
  async EditService(
    @Body() dto: { Title: string; Description: string },
    @Param('id') id: string,
  ) {
    return this.onlineOfficeService.EditService(dto, id);
  }
  @Delete('DeleteService/:id')
  async DeleteService(@Param('id') id: string) {
    return this.onlineOfficeService.DeleteService(id);
  }

  @Put('EditFolder/:ServiceId/:folderId')
  async EditFolder(
    @Body() dto: { Title: string },
    @Param('ServiceId') ServiceId: string,
    @Param('folderId') folderId: string,
  ) {
    return this.onlineOfficeService.EditFolder(dto, ServiceId, folderId);
  }

  @Delete('DeleteFolder/:ServiceId/:folderId')
  async DeleteFolder(
    @Param('ServiceId') ServiceId: string,
    @Param('folderId') folderId: string,
  ) {
    return this.onlineOfficeService.DeleteFolder(ServiceId, folderId);
  }

  @Put('RequestDeleteDocument/:DocumentId')
  async RequestDeleteDocument(
    @Param('DocumentId') DocumentId: string,
    @Request() req: any,
    @Body() body: { Reason: string },
  ) {
    return this.onlineOfficeService.RequestDeleteDocument(
      DocumentId,
      body.Reason,
      req.user.sub,
    );
  }
  @Put('RequestDeleteDocumentFromService/:ServiceId/:folderId/:DocumentId')
  async RequestDeleteDocumentFromService(
    @Param('ServiceId') ServiceId: string,
    @Param('folderId') folderId: string,
    @Param('DocumentId') DocumentId: string,
    @Request() req: any,
    @Body() body: { Reason: string },
  ) {
    return this.onlineOfficeService.RequestDeleteDocumentFromService(
      ServiceId,
      folderId,
      DocumentId,
      body.Reason,
      req.user.sub,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('GetDocumentRequests/:DocumentId')
  async GetDocumentRequests(@Param('DocumentId') DocumentId: string) {
    return this.onlineOfficeService.GetDocumentRequests(DocumentId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('GetNoteById/:NoteID')
  async GetNoteById(@Param('NoteID') NoteID: string) {
    return this.onlineOfficeService.GetNoteById(NoteID);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('DeleteDocumentConfirm/:DocumentId')
  async DeleteDocumentConfirm(@Param('DocumentId') DocumentId: string) {
    return this.onlineOfficeService.DeleteDocumentConfirm(DocumentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('GetDocumentRequestsFromService/:ServiceId/:folderId/:DocumentId')
  async GetDocumentRequestsFromService(
    @Param('ServiceId') ServiceId: string,
    @Param('folderId') folderId: string,
    @Param('DocumentId') DocumentId: string,
  ) {
    return this.onlineOfficeService.GetDocumentRequestsFromService(
      ServiceId,
      folderId,
      DocumentId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('DeleteDocumentConfirmFromService/:ServiceId/:folderId/:DocumentId')
  async DeleteDocumentConfirmFromService(
    @Param('ServiceId') ServiceId: string,
    @Param('folderId') folderId: string,
    @Param('DocumentId') DocumentId: string,
  ) {
    return this.onlineOfficeService.DeleteDocumentConfirmFromService(
      ServiceId,
      folderId,
      DocumentId,
    );
  }
}
