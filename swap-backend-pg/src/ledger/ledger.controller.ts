
import { Controller, Get, Query } from '@nestjs/common';
import { LedgerService } from './ledger.service';

@Controller('ledger')
export class LedgerController {
  constructor(private l: LedgerService) {}
  @Get() get(@Query() q: any) { return this.l.forUser(q.email); }
}
