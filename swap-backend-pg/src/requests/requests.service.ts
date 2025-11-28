import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Prisma, RequestStatus, SessionType } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { MeetingsService } from '../meetings/meetings.service';

@Injectable()
export class RequestsService {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(MeetingsService) private meetingsService: MeetingsService,
  ) {}

  private async ensureUser(email: string) {
    let u = await this.prisma.user.findUnique({ where: { email } });
    if (!u) {
      try {
        u = await this.prisma.user.create({
          data: {
            email,
            // 🎁 initial token for first-time implicit creation
            tokenLedger: { create: { tokens: 1, reason: 'initial_grant' } },
          },
        });
      } catch (error: any) {
        // Handle race condition - another request might have created the user
        if (error.code === 'P2002') {
          // Unique constraint violation - fetch the user that was created
          u = await this.prisma.user.findUnique({ where: { email } });
          if (!u) throw error; // Should never happen, but just in case
        } else {
          throw error;
        }
      }
    }
    return u;
  }

  private async tokenBalance(userId: string) {
    const agg = await this.prisma.tokenLedger.aggregate({
      where: { userId },
      _sum: { tokens: true },
    });
    return agg._sum.tokens ?? 0;
  }

  async create(fromEmail: string, toEmail: string, courseCode: string, minutes: number, note?: string, timeSlotId?: string) {
  if (fromEmail.toLowerCase() === toEmail.toLowerCase()) {
    throw new BadRequestException('Cannot send a request to yourself.');
  }

  const [fromUser, toUser] = await Promise.all([
    this.ensureUser(fromEmail),
    this.ensureUser(toEmail),
  ]);

  // If timeSlotId provided, validate it exists and is available
  if (timeSlotId) {
    const timeSlot = await this.prisma.timeSlot.findUnique({ where: { id: timeSlotId } });
    if (!timeSlot) {
      throw new BadRequestException('Time slot not found');
    }
    if (!timeSlot.isActive) {
      throw new BadRequestException('Time slot is not active');
    }
    if (timeSlot.teacherId !== toUser.id) {
      throw new BadRequestException('Time slot does not belong to this teacher');
    }

    const pendingSlotRequest = await this.prisma.request.findFirst({
      where: { timeSlotId, status: RequestStatus.PENDING },
      select: { id: true },
    });
    if (pendingSlotRequest) {
      throw new BadRequestException('Time slot already has a pending request');
    }

    const activeSession = await this.prisma.session.findFirst({
      where: { timeSlotId, status: { not: 'done' } },
      select: { id: true },
    });
    if (activeSession) {
      throw new BadRequestException('Time slot is already booked');
    }
  }

  // require ≥1 token
  const balanceAgg = await this.prisma.tokenLedger.aggregate({
    where: { userId: fromUser.id },
    _sum: { tokens: true },
  });
  const balance = balanceAgg._sum.tokens ?? 0;
  if (balance < 1) {
    throw new BadRequestException('You need at least 1 token to send a request.');
  }

  // prevent duplicate active request
  const existing = await this.prisma.request.findFirst({
    where: {
      fromUserId: fromUser.id,
      toUserId: toUser.id,
      OR: [
        { status: RequestStatus.PENDING },
        { status: RequestStatus.ACCEPTED, session: { status: { not: 'done' } } },
      ],
    },
    include: { session: true },
  });
  if (existing) {
    throw new BadRequestException('You already have an active booking request with this user.');
  }

  // Create pending request (teacher must accept)
  // Include timeSlotId if provided - it will be used when teacher accepts
  return this.prisma.request.create({
    data: {
      fromUserId: fromUser.id,
      toUserId: toUser.id,
      courseCode,
      minutes,
      note,
      timeSlotId, // Store the timeSlotId for later use when accepted
    },
  });
}


  // hide requests whose linked session is already done
  async inbox(email: string) {
    const user = await this.ensureUser(email);
    return this.prisma.request.findMany({
      where: { toUserId: user.id, OR: [{ sessionId: null }, { session: { status: { not: 'done' } } }] },
      include: { 
        session: { select: { status: true } },
        fromUser: { select: { id: true, name: true, email: true, image: true } },
        toUser: { select: { id: true, name: true, email: true, image: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sent(email: string) {
    const user = await this.ensureUser(email);
    return this.prisma.request.findMany({
      where: { fromUserId: user.id, OR: [{ sessionId: null }, { session: { status: { not: 'done' } } }] },
      include: { 
        session: { select: { status: true } },
        fromUser: { select: { id: true, name: true, email: true, image: true } },
        toUser: { select: { id: true, name: true, email: true, image: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async accept(id: string, actingEmail: string) {
    const to = await this.ensureUser(actingEmail);

    const result = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const req = await tx.request.findUnique({
        where: { id },
        include: {
          timeSlot: true,
          fromUser: { select: { email: true } },
          toUser: { select: { email: true } },
        },
      });
      if (!req) throw new BadRequestException('Request not found');
      if (req.toUserId !== to.id) throw new BadRequestException('Not authorized to accept');
      if (req.status !== RequestStatus.PENDING) return req;

      // 💳 learner must have ≥1 token at acceptance time
      const agg = await tx.tokenLedger.aggregate({
        where: { userId: req.fromUserId },
        _sum: { tokens: true },
      });
      const learnerBalance = agg._sum.tokens ?? 0;
      if (learnerBalance < 1) {
        throw new BadRequestException('Requester has insufficient tokens.');
      }

      // Calculate startAt and endAt if timeSlot exists
      let startAt: Date | undefined;
      let endAt: Date | undefined;
      
      if (req.timeSlot) {
        // Calculate next occurrence of the day of week
        const now = new Date();
        const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const targetDayIndex = daysOfWeek.indexOf(req.timeSlot.dayOfWeek);
        const currentDayIndex = now.getDay();
        
        let daysUntilTarget = targetDayIndex - currentDayIndex;
        if (daysUntilTarget <= 0) daysUntilTarget += 7; // Next week if today or past
        
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + daysUntilTarget);
        
        // Parse time (HH:MM format)
        const [startHour, startMin] = req.timeSlot.startTime.split(':').map(Number);
        const [endHour, endMin] = req.timeSlot.endTime.split(':').map(Number);
        
        startAt = new Date(targetDate);
        startAt.setHours(startHour, startMin, 0, 0);
        
        endAt = new Date(targetDate);
        endAt.setHours(endHour, endMin, 0, 0);
      }

      // Get session type from timeSlot if available
      const sessionType = req.timeSlot?.sessionType || SessionType.ONLINE;

      const session = await tx.session.create({
        data: {
          teacherId: req.toUserId,
          learnerId: req.fromUserId,
          courseCode: req.courseCode,
          minutes: req.minutes,
          timeSlotId: req.timeSlotId,
          startAt, // Set automatically if timeSlot exists
          endAt,   // Set automatically if timeSlot exists
          sessionType,
        },
      });

      await tx.request.update({
        where: { id },
        data: { status: RequestStatus.ACCEPTED, sessionId: session.id },
      });

      // ⬇️ deduct learner token immediately on accept
      await tx.tokenLedger.create({
        data: { userId: req.fromUserId, sessionId: session.id, tokens: -1, reason: 'token_spent_on_session' },
      });

      // time credits (as before)
      await tx.creditLedger.createMany({
        data: [
          { userId: session.teacherId, sessionId: session.id, delta: req.minutes, reason: 'session_taught' },
          { userId: session.learnerId, sessionId: session.id, delta: -req.minutes, reason: 'session_taken' },
        ],
      });

      // ensure chat thread exists
      const [a, b] = req.fromUserId < req.toUserId ? [req.fromUserId, req.toUserId] : [req.toUserId, req.fromUserId];
      await tx.chatThread.upsert({
        where: { pair_unique: { participantAId: a, participantBId: b } },
        update: {},
        create: { participantAId: a, participantBId: b },
      });

      return {
        session,
        sessionType,
        startAt,
        minutes: req.minutes,
        courseCode: req.courseCode,
        teacherEmail: req.toUser?.email || '',
        learnerEmail: req.fromUser?.email || '',
      };
    }, { timeout: 20000 });

    if (!('session' in result)) {
      return result;
    }

    let session = result.session;

    if (result.sessionType === SessionType.ONLINE) {
      const meetingLink = await this.meetingsService.generateMeetingLink(
        session.id,
        result.teacherEmail,
        result.learnerEmail,
        result.courseCode,
        result.startAt,
        result.minutes,
      );

      session = await this.prisma.session.update({
        where: { id: session.id },
        data: { meetingLink },
      });
    }

    return session;
  }

  async decline(id: string, actingEmail: string) {
    const to = await this.ensureUser(actingEmail);
    const req = await this.prisma.request.findUnique({ where: { id } });
    if (!req) throw new BadRequestException('Request not found');
    if (req.toUserId !== to.id) throw new BadRequestException('Not authorized to decline');
    return this.prisma.request.update({ where: { id }, data: { status: RequestStatus.DECLINED } });
  }

  async clearAnsweredRequests(actingEmail: string) {
    const user = await this.ensureUser(actingEmail);
    
    // Delete all requests where user is either sender or receiver and status is ACCEPTED or DECLINED
    const result = await this.prisma.request.deleteMany({
      where: {
        OR: [
          { fromUserId: user.id },
          { toUserId: user.id }
        ],
        status: {
          in: [RequestStatus.ACCEPTED, RequestStatus.DECLINED]
        }
      }
    });

    return { 
      success: true, 
      deletedCount: result.count,
      message: `Cleared ${result.count} answered requests`
    };
  }

  async clearAllRequests(actingEmail: string) {
    const user = await this.ensureUser(actingEmail);
    
    // Delete ALL requests where user is either sender or receiver
    const result = await this.prisma.request.deleteMany({
      where: {
        OR: [
          { fromUserId: user.id },
          { toUserId: user.id }
        ]
      }
    });

    return { 
      success: true, 
      deletedCount: result.count,
      message: `Cleared ${result.count} requests`
    };
  }
}
