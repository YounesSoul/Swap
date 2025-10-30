import { Module } from '@nestjs/common';
import { RatingController } from './ratings.controller';
import { RatingService } from './ratings.service';

@Module({
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}