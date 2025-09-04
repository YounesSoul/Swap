import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { IsEmail } from 'class-validator';

class ActDto { @IsEmail() actingEmail!: string; }

@Controller('sessions')
export class SessionsController {
  constructor(private s: SessionsService) {}

  @Get() list(@Query() q: any) { return this.s.forUser(q.email); }

  @Post(':id/done') done(@Param('id') id: string, @Body() dto: ActDto) {
    return this.s.complete(id, dto.actingEmail);
  }
  @Post(':id/schedule')
  schedule(@Param('id') id: string, @Body() dto: ScheduleDto) {
    return this.s.schedule(id, dto.actingEmail, dto.startAt);
  }
}
