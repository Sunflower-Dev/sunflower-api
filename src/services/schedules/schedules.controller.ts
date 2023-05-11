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
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { SchedulesService } from './schedules.service';

@UseGuards(AuthGuard('jwt'))
@Controller('schedules')
export class schedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  async create(@Body() dto: CreateScheduleDto, @Request() req: any) {
    return this.schedulesService.create(dto, req.user.sub);
  }

  @Get()
  async GetAll(@Request() req: any) {
    return this.schedulesService.GetAll(req.user.sub);
  }

  @Get(':id')
  async GetSchedule(@Param() param: { id: string }) {
    return this.schedulesService.GetById(param.id);
  }

  @Put(':id')
  async EditSchedule(
    @Param() Param: { id: string },
    @Body() dto: CreateScheduleDto,
  ) {
    return this.schedulesService.Edit(Param.id, dto);
  }

  @Delete(':id')
  async DeleteSchedule(@Param() Param: { id: string }) {
    return this.schedulesService.RemoveSchedule(Param.id);
  }

  @Put('/Cancel/:id')
  async CancelSchedule(@Param() Param: { id: string }) {
    return this.schedulesService.CancelSchedule(Param.id);
  }
  @Put('/Complete/:id')
  async CompleteSchedule(@Param() Param: { id: string }) {
    return this.schedulesService.CompleteSchedule(Param.id);
  }
}
