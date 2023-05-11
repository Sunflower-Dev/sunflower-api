import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  UploadedFile,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ClientsService } from './clients.service';
import { AddReportDto } from './dto/AddReport-dto';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req: any) {
    return this.clientsService.GetClientList(req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.clientsService.findOne(id, req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('AddDocument/:id')
  @UseInterceptors(
    FileInterceptor('File', {
      storage: diskStorage({
        destination: '../public/Uploads/Client/Documents',
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
  async AddDocument(
    @UploadedFile() File: Express.Multer.File,
    @Body() body: any,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.clientsService.AddDocumentToClient(
      {
        CreatedAt: new Date(),
        Status: 'IDLE',
        Title: body.Title,
        Uploader: req.user.sub,
        File: '/Uploads/Client/Documents/' + File.filename,
        Type: extname(File.filename).replace(/[.]/g, '').toUpperCase(),
      },
      id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('GetEdit/:id')
  GetEdit(@Param('id') id: string) {
    return this.clientsService.GetClientForEdit(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('Edit/:id')
  EditClient(
    @Param('id') id: string,
    @Body() dto: CreateClientDto,
    @Request() req: any,
  ) {
    return this.clientsService.EditClient(dto, id, req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('ChangeAvatar/:id')
  @UseInterceptors(
    FileInterceptor('File', {
      storage: diskStorage({
        destination: '../public/Uploads/Client/Avatars',
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
  async ChangeAvatar(
    @UploadedFile() File: Express.Multer.File,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.clientsService.ChangeAvatar(
      '/Uploads/Client/Avatars/' + File.filename,
      id,
      req.user.sub,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('AddReport/:id')
  @UseInterceptors(
    FileInterceptor('File', {
      storage: diskStorage({
        destination: '../public/Uploads/Client/Signature',
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
  async AddReport(
    @UploadedFile() File: Express.Multer.File,
    @Request() req: any,
    @Body() body: AddReportDto,
    @Param('id') id: string,
  ) {
    return this.clientsService.AddReport(
      body,
      req.user.sub,
      '/Uploads/Client/Signature/' + File.filename,
      id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('GetReport/:id')
  async GetReportById(@Param('id') id: string) {
    return this.clientsService.GetReportById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('RequestDeleteDocument/:DocumentId')
  async RequestDeleteDocument(
    @Param('DocumentId') DocumentId: string,
    @Request() req: any,
    @Body() body: { Reason: string },
  ) {
    return this.clientsService.RequestDeleteDocument(
      DocumentId,
      body.Reason,
      req.user.sub,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('GetDocumentRequests/:DocumentId')
  async GetDocumentRequests(@Param('DocumentId') DocumentId: string) {
    return this.clientsService.GetDocumentRequests(DocumentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('DeleteDocumentConfirm/:DocumentId')
  async DeleteDocumentConfirm(@Param('DocumentId') DocumentId: string) {
    return this.clientsService.DeleteDocumentConfirm(DocumentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('AddMedicine/:ClientId')
  async AddMedicine(
    @Param('ClientId') ClientId: string,
    @Request() req: any,
    @Body()
    body: { Title: string; Pills: { Medication: string; Number: string }[] },
  ) {
    return this.clientsService.AddMedicine(ClientId, req.user.sub, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('DeleteMedicine/:ClientId/:MedicineId')
  async DeleteMedicine(
    @Param('ClientId') ClientId: string,
    @Param('MedicineId') MedicineId: string,
  ) {
    return this.clientsService.DeleteMedicine(ClientId, MedicineId);
  }
}
