
import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { MeetingsModule } from '../meetings/meetings.module';

@Module({ 
  imports: [MeetingsModule],
  providers: [RequestsService], 
  controllers: [RequestsController] 
})
export class RequestsModule {}
