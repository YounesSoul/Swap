
import { Module } from '@nestjs/common';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

@Module({ providers: [TokensService], controllers: [TokensController] })
export class TokensModule {}
