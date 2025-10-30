
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module';
import { UsersModule } from './users/users.module';
import { RequestsModule } from './requests/requests.module';
import { SessionsModule } from './sessions/sessions.module';
import { LedgerModule } from './ledger/ledger.module';
import { TokensModule } from './tokens/tokens.module';
import { ChatModule } from './chat/chat.module';
import { SearchModule } from './search/search.module';
import { TranscriptsModule } from './transcripts/transcripts.module';
import { RatingModule } from './ratings/ratings.module';
import { TimeSlotsModule } from './timeslots/timeslots.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    RequestsModule,
    SessionsModule,
    LedgerModule,
    TokensModule,
    ChatModule,
    SearchModule,
    TranscriptsModule,
    RatingModule,
    TimeSlotsModule
  ],
})
export class AppModule {}

