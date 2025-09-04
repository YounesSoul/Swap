import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private s: SearchService) {}

  @Get('teachers')
  teachers(@Query('skill') skill?: string, @Query('course') course?: string) {
    if (skill) return this.s.teachersBySkill(skill);
    if (course) return this.s.teachersByCourse(course);
    return [];
  }

  @Get('skills')
  skills(@Query('q') q: string) { return this.s.suggestSkills(q || ''); }
}
