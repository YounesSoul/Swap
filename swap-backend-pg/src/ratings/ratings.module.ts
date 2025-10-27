import { Module } from '@nestjs/common';
import { RatingController } from './ratings.controller';
import { RatingService } from './ratings.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [RatingController],
  providers: [RatingService, PrismaService],
  exports: [RatingService],
})
export class RatingModule {}