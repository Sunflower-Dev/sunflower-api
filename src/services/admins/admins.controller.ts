import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Admin } from 'src/schemas/admin.schema';
import { AdminsService } from './admins.service';
import { AuthDto, CreateAdminDto } from './dto';
import { ChangePassword } from './dto/ChangePassword.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post('New')
  async NewAdmin(@Body() body: CreateAdminDto): Promise<Admin> {
    return this.adminsService.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async GetList(@Request() req: any) {
    return this.adminsService.GetList(req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  GetAdmin(@Param('id') id: string, @Request() req: any) {
    if (id === 'myprofile') {
      return this.adminsService.GetProfile(
        { _id: req.user.sub },
        'Name Avatar _id BirthDate Sex Nationality Language PhoneNumber Email Address About Clients_IDs Permissions',
      );
    } else if (id === 'GetPermission') {
      return this.adminsService.FindOne(
        { _id: req.user.sub },
        '_id Permissions Name Avatar',
      );
    } else {
      return this.adminsService.FindOne(
        { _id: id },
        'Name Avatar _id BirthDate Sex Nationality Language PhoneNumber Email Address About Clients_IDs Permissions',
      );
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('/Edit/:id')
  EditAdmin(@Param() param: { id: string }, @Body() body: CreateAdminDto) {
    return this.adminsService.Update(body, { _id: param.id });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  DeleteAdmin(@Param() param: { id: string }) {
    if (param.id === '620cd04f609d6b2cfa352758') {
      throw new UnauthorizedException('Cant Delete SuperAdmin');
    } else {
      return this.adminsService.DeleteAdmin({ _id: param.id });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('DeleteClient/:AdminID')
  DeleteClientFromAdmin(
    @Param() param: { AdminID: string },
    @Body() body: any,
  ) {
    return this.adminsService.DeleteClientFromAdmin(
      param.AdminID,
      body.ClientID,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('AddClient/:AdminID')
  async AddClient(@Param() param: { AdminID: string }, @Body() body: any) {
    return this.adminsService.AddClientFromAdmin(param.AdminID, body.ClientID);
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('UpdatePermission/:AdminID')
  async UpdatePermission(@Param('AdminID') AdminID: string, @Body() body: any) {
    return this.adminsService.UpdatePermissions(AdminID, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('ChangePassword')
  async ChangePassword(@Body() body: ChangePassword, @Request() req: any) {
    return this.adminsService.ChangePassword(body, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('ChangeMyAvatar')
  @UseInterceptors(
    FileInterceptor('File', {
      storage: diskStorage({
        destination: '../public/Uploads/Admin/Avatars',
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
  async ChangeMyAvatar(
    @UploadedFile() File: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.adminsService.ChangeAvatar(
      '/Uploads/Admin/Avatars/' + File.filename,
      req.user.sub,
    );
  }

  @Post('Login')
  Login(@Body() dto: AuthDto) {
    return this.adminsService.Login(dto);
  }

  @Post('forgotpass/SendRecoveryCode')
  SendRecoveryCode(@Body() body: { Email: string }) {
    return this.adminsService.SendRecoveryCode(body.Email);
  }

  @Post('forgotpass/VerifyRecoveryCode')
  VerifyRecoveryCode(@Body() body: { Email: string; Code: string }) {
    return this.adminsService.VerifyRecoveryCode(body);
  }

  @Put('forgotpass/NewPassword')
  NewPassword(@Body() body: { Email: string; Code: string; Password: string }) {
    return this.adminsService.NewPassword(body);
  }
}
