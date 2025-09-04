import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

 private async ensureUser(email: string) {
  let u = await this.prisma.user.findUnique({ where: { email } });
  if (!u) {
    u = await this.prisma.user.create({
      data: { email, tokenLedger: { create: { tokens: 1, reason: 'initial_grant' } } },
    });
  }
  return u;
}


  private normalizedPair(u1: string, u2: string): [string, string] {
    return u1 < u2 ? [u1, u2] : [u2, u1];
  }

  async ensureThread(userEmail: string, otherEmail: string) {
    const [u, o] = await Promise.all([this.ensureUser(userEmail), this.ensureUser(otherEmail)]);
    const [a, b] = this.normalizedPair(u.id, o.id);
    return this.prisma.chatThread.upsert({
      where: { pair_unique: { participantAId: a, participantBId: b } },
      update: {},
      create: { participantAId: a, participantBId: b },
      include: {
        participantA: { select: { id: true, email: true, name: true } },
        participantB: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async listThreads(email: string) {
    const me = await this.ensureUser(email);
    const threads = await this.prisma.chatThread.findMany({
      where: { OR: [{ participantAId: me.id }, { participantBId: me.id }] },
      orderBy: { createdAt: 'desc' },
      include: {
        participantA: { select: { id: true, email: true, name: true } },
        participantB: { select: { id: true, email: true, name: true } },
      },
    });
    return threads.map(t => {
      const other = t.participantAId === me.id ? t.participantB : t.participantA;
      return { id: t.id, other };
    });
  }

  async listMessages(threadId: string, after?: string) {
    return this.prisma.message.findMany({
      where: { threadId, ...(after ? { createdAt: { gt: new Date(after) } } : {}) },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(threadId: string, senderEmail: string, text: string) {
    const sender = await this.ensureUser(senderEmail);
    return this.prisma.message.create({
      data: { threadId, senderId: sender.id, text },
    });
  }
}
