
import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TokensService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}
  async forUser(email: string) {
    const u = await this.prisma.user.findUnique({ where: { email } });
    if (!u) return { tokens: 0, entries: [] };
    const entries = await this.prisma.tokenLedger.findMany({ where: { userId: u.id }, orderBy: { createdAt: 'desc' } });
    const tokens = entries.reduce((a, e) => a + e.tokens, 0);
    return { tokens, entries };
  }
}
