import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateNotificationDto } from './dto/CreateNotification.dto';
import { NotificationsService } from './notifications.service';

@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async Create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.Create(dto);
  }

  @Get()
  async GetList(@Request() req: any) {
    return this.notificationsService.GetList(req.user.sub);
  }

  @Get(':id')
  async GetByID(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.FindOne(id, req.user.sub);
  }

  @Delete(':id')
  async DeleteByID(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.DeleteNotifForAdmin(id, req.user.sub);
  }
}
