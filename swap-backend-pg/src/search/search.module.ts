import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { PrismaService } from '../prisma.service';
import { RatingService } from '../ratings/ratings.service';

@Module({ 
  providers: [SearchService, PrismaService, RatingService], 
  controllers: [SearchController] 
})
export class SearchModule {}
