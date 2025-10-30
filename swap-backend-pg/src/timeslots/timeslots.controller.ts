import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { TimeSlotsService } from './timeslots.service';

// Simple auth guard to extract email from session
function getEmailFromRequest(req: any): string {
  return req.headers['x-user-email'] || req.user?.email || 'unknown@example.com';
}

enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

class CreateTimeSlotDto {
  @IsString()
  type!: 'course' | 'skill';
  
  @IsOptional()
  @IsString()
  courseCode?: string;
  
  @IsOptional()
  @IsString()
  skillName?: string;
  
  @IsEnum(DayOfWeek)
  dayOfWeek!: DayOfWeek;
  
  @IsString()
  startTime!: string; // HH:MM
  
  @IsString()
  endTime!: string; // HH:MM
}

class UpdateTimeSlotDto {
  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;
  
  @IsOptional()
  @IsString()
  startTime?: string;
  
  @IsOptional()
  @IsString()
  endTime?: string;
  
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@Controller('timeslots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  // Create a new time slot
  @Post()
  async createSlot(@Req() req: any, @Body() body: CreateTimeSlotDto) {
    const email = getEmailFromRequest(req);
    return this.timeSlotsService.createSlot(
      email,
      body.type,
      body.courseCode || null,
      body.skillName || null,
      body.dayOfWeek,
      body.startTime,
      body.endTime,
    );
  }

  // Get current user's time slots
  @Get('my-slots')
  async getMySlots(@Req() req: any) {
    const email = getEmailFromRequest(req);
    return this.timeSlotsService.getUserSlots(email);
  }

  // Get available time slots for a course or skill
  @Get('available')
  async getAvailableSlots(@Query('type') type: 'course' | 'skill', @Query('query') query: string) {
    return this.timeSlotsService.getAvailableSlots(type, query);
  }

  // Get available slots for a specific teacher and course/skill
  @Get('teacher/:teacherId')
  async getTeacherSlots(
    @Param('teacherId') teacherId: string,
    @Query('type') type: 'course' | 'skill',
    @Query('query') query: string,
  ) {
    return this.timeSlotsService.getTeacherAvailableSlots(teacherId, type, query);
  }

  // Update a time slot
  @Patch(':id')
  async updateSlot(@Req() req: any, @Param('id') id: string, @Body() body: UpdateTimeSlotDto) {
    const email = getEmailFromRequest(req);
    return this.timeSlotsService.updateSlot(id, email, body);
  }

  // Delete a time slot
  @Delete(':id')
  async deleteSlot(@Req() req: any, @Param('id') id: string) {
    const email = getEmailFromRequest(req);
    return this.timeSlotsService.deleteSlot(id, email);
  }

  // Deactivate a time slot (soft delete)
  @Patch(':id/deactivate')
  async deactivateSlot(@Req() req: any, @Param('id') id: string) {
    const email = getEmailFromRequest(req);
    return this.timeSlotsService.deactivateSlot(id, email);
  }
}
