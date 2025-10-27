import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RatingService } from '../ratings/ratings.service';

const slugify = (s: string) => s.trim().toLowerCase();

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private ratingService: RatingService,
  ) {}

  async teachersBySkill(skillQuery: string) {
    const slug = slugify(skillQuery);
    const skills = await this.prisma.skill.findMany({
      where: { slug: { contains: slug } },
      take: 10,
    });
    const skillIds = skills.map(s => s.id);
    if (skillIds.length === 0) return [];

    const us = await this.prisma.userSkill.findMany({
      where: { skillId: { in: skillIds } },
      include: { user: true, skill: true },
      take: 50,
    });

    // group by user
    const byUser: Record<string, any> = {};
    for (const row of us) {
      const u = row.user;
      if (!byUser[u.id]) byUser[u.id] = { user: { id: u.id, name: u.name, email: u.email, image: u.image }, skills: [] as any[] };
      byUser[u.id].skills.push({ name: row.skill.name, level: row.level });
    }

    // Add rating information
    const userResults = Object.values(byUser);
    for (const result of userResults) {
      const ratingStats = await this.ratingService.getUserRatingStats(result.user.id, 'skill');
      result.rating = {
        average: ratingStats.averageRating || 4.5, // Default to 4.5 if no ratings
        count: ratingStats.totalRatings,
      };
    }

    return userResults;
  }

  async teachersByCourse(code: string) {
    const rows = await this.prisma.userCourse.findMany({
      where: { courseCode: { contains: code, mode: 'insensitive' }, grade: { startsWith: 'A', mode: 'insensitive' } },
      include: { user: true },
      take: 50,
    });

    const results = rows.map(r => ({
      user: { id: r.user.id, name: r.user.name, email: r.user.email, image: r.user.image },
      course: { code: r.courseCode, grade: r.grade },
      rating: { average: 4.5, count: 0 }, // Will be updated below
    }));

    // Add rating information
    for (const result of results) {
      const ratingStats = await this.ratingService.getUserRatingStats(result.user.id, 'course');
      result.rating = {
        average: ratingStats.averageRating || 4.5, // Default to 4.5 if no ratings
        count: ratingStats.totalRatings,
      };
    }

    return results;
  }

  async suggestSkills(q: string) {
    const slug = slugify(q);
    return this.prisma.skill.findMany({
      where: { slug: { startsWith: slug } },
      select: { name: true },
      take: 10,
    });
  }
}
