import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClientLogService } from './client-log.service';

@UseGuards(AuthGuard('jwt'))
@Controller('client-log')
export class ClientLogController {
  constructor(private readonly clientLogService: ClientLogService) {}

  @Get()
  async GetLogs(@Request() req: any) {
    return await this.clientLogService.GetListWithPermissionApplied(
      { Admin: req.user.sub },
      null,
      req.user.sub,
    );
  }
}
