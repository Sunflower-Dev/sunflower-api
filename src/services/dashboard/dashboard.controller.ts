import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';

@UseGuards(AuthGuard('jwt'))
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get(':Type')
  async GetDashboard(@Request() req: any, @Param('Type') Type: string) {
    return this.dashboardService.GetDashboard(req.user.sub, Type);
  }
}
