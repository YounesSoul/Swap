
import { Controller, Get, Query } from '@nestjs/common';
import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private t: TokensService) {}
  @Get() get(@Query() q: any) { return this.t.forUser(q.email); }
}
