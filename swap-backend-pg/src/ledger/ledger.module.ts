
import { Module } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { LedgerController } from './ledger.controller';
import { PrismaService } from '../prisma.service';

@Module({ providers: [LedgerService, PrismaService], controllers: [LedgerController] })
export class LedgerModule {}
