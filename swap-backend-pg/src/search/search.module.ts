import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { RatingService } from '../ratings/ratings.service';

@Module({ 
  providers: [SearchService, RatingService], 
  controllers: [SearchController] 
})
export class SearchModule {}
