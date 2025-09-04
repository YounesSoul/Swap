
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LedgerService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}
  async forUser(email: string) {
    const u = await this.prisma.user.findUnique({ where: { email } });
    if (!u) return { balance: 0, entries: [] };
    const entries = await this.prisma.creditLedger.findMany({ where: { userId: u.id }, orderBy: { createdAt: 'desc' } });
    const balance = entries.reduce((a, e) => a + e.delta, 0);
    return { balance, entries };
  }
}
