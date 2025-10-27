import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Prisma, RequestStatus } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RequestsService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  private async ensureUser(email: string) {
    let u = await this.prisma.user.findUnique({ where: { email } });
    if (!u) {
      u = await this.prisma.user.create({
        data: {
          email,
          // 🎁 initial token for first-time implicit creation
          tokenLedger: { create: { tokens: 1, reason: 'initial_grant' } },
        },
      });
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

  async create(fromEmail: string, toEmail: string, courseCode: string, minutes: number, note?: string) {
  if (fromEmail.toLowerCase() === toEmail.toLowerCase()) {
    throw new BadRequestException('Cannot send a request to yourself.');
  }

  const [fromUser, toUser] = await Promise.all([
    this.ensureUser(fromEmail),
    this.ensureUser(toEmail),
  ]);

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

  return this.prisma.request.create({
    data: {
      fromUserId: fromUser.id,
      toUserId: toUser.id,
      courseCode,
      minutes,
      note,
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

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const req = await tx.request.findUnique({ where: { id } });
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

      const session = await tx.session.create({
        data: {
          teacherId: req.toUserId,
          learnerId: req.fromUserId,
          courseCode: req.courseCode,
          minutes: req.minutes,
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

      return session;
    });
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
