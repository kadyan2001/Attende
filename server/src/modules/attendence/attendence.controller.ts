import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('attendence')
export class AttendenceController {
  constructor(private readonly attendenceService: AttendenceService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  async addAttendence(@Req() req: any) {
    return this.attendenceService.addAttendence(req.body);
  }

  @Get('get-all')
  @UseGuards(JwtAuthGuard)
  async getAttendences(@Req() req: any) {
    return this.attendenceService.getAttendences(req.user);
  }

  @Get('get-with-date')
  @UseGuards(JwtAuthGuard)
  async getAttendencesWithDate(@Req() req: any) {
    return this.attendenceService.getAttendancesWithDate(req.query);
  }
}
