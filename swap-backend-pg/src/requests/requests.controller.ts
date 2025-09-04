
import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CreateRequestDto {
  @IsEmail() fromEmail!: string;
  @IsEmail() toEmail!: string;
  @IsString() courseCode!: string;
  @Type(() => Number) @IsInt() @Min(15) minutes!: number;
  @IsOptional() @IsString() note?: string;
}

class ActDto { @IsEmail() actingEmail!: string; }

@Controller('requests')
export class RequestsController {
  constructor(private reqs: RequestsService) {}
  @Post() create(@Body() dto: CreateRequestDto) { return this.reqs.create(dto.fromEmail, dto.toEmail, dto.courseCode, dto.minutes, dto.note); }
  @Get() list(@Query() q: any) {
    if (q.inbox && q.email) return this.reqs.inbox(q.email);
    if (q.sent && q.email) return this.reqs.sent(q.email);
    return [];
  }
  @Post(':id/accept') accept(@Param('id') id: string, @Body() dto: ActDto) { return this.reqs.accept(id, dto.actingEmail); }
  @Post(':id/decline') decline(@Param('id') id: string, @Body() dto: ActDto) { return this.reqs.decline(id, dto.actingEmail); }
}
