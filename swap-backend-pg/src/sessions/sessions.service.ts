import { Injectable, Inject } from '@nestjs/common';
import { Prisma, PrismaClientKnownRequestError } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SessionsService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async forUser(email: string) {
    const u = await this.prisma.user.findUnique({ where: { email } });
    if (!u) return [];
    return this.prisma.session.findMany({
      where: { OR: [{ teacherId: u.id }, { learnerId: u.id }] },
      orderBy: { createdAt: 'desc' },
      include: { teacher: { select: { email: true, name: true } }, learner: { select: { email: true, name: true } } },
    });
  }

  // Mark session as done & mint tokens once (idempotent)
  async complete(id: string, actingEmail: string) {
    const actor = await this.prisma.user.findUnique({ where: { email: actingEmail } });
    if (!actor) throw new Error('Actor not found');

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const s = await tx.session.findUnique({ where: { id } });
      if (!s) throw new Error('Session not found');
      if (s.teacherId !== actor.id && s.learnerId !== actor.id) throw new Error('Not authorized');

      // update status
      const updated = await tx.session.update({
        where: { id },
        data: { status: 'done', endAt: new Date() },
      });

      // mint tokens to teacher if not already minted for completion
      const already = await tx.tokenLedger.findFirst({
        where: { sessionId: id, reason: 'token_minted_from_completion' },
      });
      const tokens = Math.floor(s.minutes / 60);
      if (!already && tokens > 0) {
        await tx.tokenLedger.create({
          data: { userId: s.teacherId, sessionId: s.id, tokens, reason: 'token_minted_from_completion' },
        });
      }
      return updated;
    });
  }
async schedule(id: string, actingEmail: string, startAtISO: string) {
    const actor = await this.prisma.user.findUnique({ where: { email: actingEmail } });
    if (!actor) throw new Error('Actor not found');

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const s = await tx.session.findUnique({ where: { id } });
      if (!s) throw new Error('Session not found');
      if (s.teacherId !== actor.id && s.learnerId !== actor.id) throw new Error('Not authorized');
      if (s.status === 'done') throw new Error('Session already completed');

      const startAt = new Date(startAtISO);
      const endAt = new Date(startAt.getTime() + s.minutes * 60000);

      return tx.session.update({ where: { id }, data: { startAt, endAt } });
    });
  }
}

