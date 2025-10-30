import { Module } from '@nestjs/common';
import { TimeSlotsController } from './timeslots.controller';
import { TimeSlotsService } from './timeslots.service';

@Module({
  controllers: [TimeSlotsController],
  providers: [TimeSlotsService],
  exports: [TimeSlotsService],
})
export class TimeSlotsModule {}
