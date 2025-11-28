import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { DayOfWeek, SessionType, RequestStatus } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TimeSlotsService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  // Create a new time slot for a teacher
  async createSlot(
    email: string,
    type: 'course' | 'skill',
    courseCode: string | null,
    skillName: string | null,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    sessionType: SessionType = SessionType.ONLINE,
  ) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    // Validate time format (HH:MM)
    console.log('Validating times - startTime:', startTime, 'type:', typeof startTime);
    console.log('Validating times - endTime:', endTime, 'type:', typeof endTime);
    
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    console.log('startTime test result:', timeRegex.test(startTime));
    console.log('endTime test result:', timeRegex.test(endTime));
    
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      throw new BadRequestException('Invalid time format. Use HH:MM (e.g., 14:00)');
    }

    // Validate type matches courseCode/skillName
    if (type === 'course' && !courseCode) {
      throw new BadRequestException('Course code required for course slots');
    }
    if (type === 'skill' && !skillName) {
      throw new BadRequestException('Skill name required for skill slots');
    }

    // Check for overlapping slots on same day
    const overlapping = await this.prisma.timeSlot.findFirst({
      where: {
        teacherId: user.id,
        dayOfWeek,
        isActive: true,
        OR: [
          { AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }] },
          { AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }] },
          { AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }] },
        ],
      },
    });

    if (overlapping) {
      throw new BadRequestException('Time slot overlaps with existing slot');
    }

    return this.prisma.timeSlot.create({
      data: {
        teacherId: user.id,
        type,
        courseCode: type === 'course' ? courseCode : null,
        skillName: type === 'skill' ? skillName : null,
        dayOfWeek,
        startTime,
        endTime,
        sessionType,
      },
    });
  }

  // Get all time slots for a user (teacher)
  async getUserSlots(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.timeSlot.findMany({
      where: { teacherId: user.id },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      include: {
        _count: {
          select: { sessions: true },
        },
      },
    });
  }

  // Get available time slots for a specific course or skill
  async getAvailableSlots(type: 'course' | 'skill', courseCodeOrSkill: string) {
    const baseWhere =
      type === 'course'
        ? { type: 'course', courseCode: courseCodeOrSkill }
        : { type: 'skill', skillName: courseCodeOrSkill };

    return this.prisma.timeSlot.findMany({
      where: {
        ...baseWhere,
        isActive: true,
        requests: { none: { status: RequestStatus.PENDING } },
        sessions: { none: { status: { not: 'done' } } },
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: { sessions: true },
        },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  // Get available slots for a specific teacher and course/skill
  async getTeacherAvailableSlots(teacherId: string, type: 'course' | 'skill', courseCodeOrSkill: string) {
    const baseWhere: any = {
      teacherId,
      type,
    };

    if (type === 'course') {
      baseWhere.courseCode = courseCodeOrSkill;
    } else {
      baseWhere.skillName = courseCodeOrSkill;
    }

    return this.prisma.timeSlot.findMany({
      where: {
        ...baseWhere,
        isActive: true,
        requests: { none: { status: RequestStatus.PENDING } },
        sessions: { none: { status: { not: 'done' } } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  // Update a time slot
  async updateSlot(
    slotId: string,
    email: string,
    updates: {
      dayOfWeek?: DayOfWeek;
      startTime?: string;
      endTime?: string;
      isActive?: boolean;
      sessionType?: SessionType;
    },
  ) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const slot = await this.prisma.timeSlot.findUnique({ where: { id: slotId } });
    if (!slot) throw new NotFoundException('Time slot not found');
    if (slot.teacherId !== user.id) throw new BadRequestException('Not authorized');

    // Validate time format if updating times
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (updates.startTime && !timeRegex.test(updates.startTime)) {
      throw new BadRequestException('Invalid start time format. Use HH:MM');
    }
    if (updates.endTime && !timeRegex.test(updates.endTime)) {
      throw new BadRequestException('Invalid end time format. Use HH:MM');
    }

    return this.prisma.timeSlot.update({
      where: { id: slotId },
      data: updates,
    });
  }

  // Delete a time slot
  async deleteSlot(slotId: string, email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const slot = await this.prisma.timeSlot.findUnique({ where: { id: slotId } });
    if (!slot) throw new NotFoundException('Time slot not found');
    if (slot.teacherId !== user.id) throw new BadRequestException('Not authorized');

    return this.prisma.timeSlot.delete({ where: { id: slotId } });
  }

  // Deactivate instead of delete (soft delete)
  async deactivateSlot(slotId: string, email: string) {
    return this.updateSlot(slotId, email, { isActive: false });
  }
}
