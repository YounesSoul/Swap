import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface CreateRatingDto {
  raterId: string;
  ratedId: string;
  sessionId?: string;
  rating: number; // 1-5
  review?: string;
  category: 'skill' | 'course';
  skillOrCourse: string;
}

export interface RatingStatsDto {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async createRating(data: CreateRatingDto) {
    // Enforce session-based ratings only
    if (!data.sessionId) {
      throw new Error('Ratings can only be created for completed sessions');
    }

    // Validate session exists and is completed
    const session = await this.prisma.session.findUnique({
      where: { id: data.sessionId },
      include: { teacher: true, learner: true }
    });

    if (!session) {
      throw new Error('Session not found');
    }

    if (session.status !== 'done') {
      throw new Error('Ratings can only be created for completed sessions');
    }

    // Verify rater is the learner in this session
    if (session.learnerId !== data.raterId) {
      throw new Error(`Only learners can rate their teachers after session completion. Expected learner: ${session.learnerId}, got rater: ${data.raterId}`);
    }

    // Verify rated user is the teacher in this session
    if (session.teacherId !== data.ratedId) {
      throw new Error(`Can only rate the teacher from this session. Expected teacher: ${session.teacherId}, got rated: ${data.ratedId}`);
    }

    // Prevent self-rating (additional check)
    if (data.raterId === data.ratedId) {
      throw new Error('Users cannot rate themselves');
    }

    // Validate rating range
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    try {
      const rating = await this.prisma.rating.create({
        data: {
          raterId: data.raterId,
          ratedId: data.ratedId,
          sessionId: data.sessionId,
          rating: data.rating,
          review: data.review,
          category: data.category,
          skillOrCourse: data.skillOrCourse,
        },
        include: {
          rater: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return rating;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('You have already rated this user for this session');
      }
      throw error;
    }
  }

  async sessionRatingExists(sessionId: string, raterId: string): Promise<boolean> {
    const rating = await this.prisma.rating.findFirst({
      where: {
        sessionId,
        raterId,
      },
    });
    return !!rating;
  }

  async updateRating(ratingId: string, raterId: string, data: { rating: number; review?: string }) {
    // Validate rating range
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const rating = await this.prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new Error('Rating not found');
    }

    if (rating.raterId !== raterId) {
      throw new Error('You can only update your own ratings');
    }

    return this.prisma.rating.update({
      where: { id: ratingId },
      data: {
        rating: data.rating,
        review: data.review,
      },
      include: {
        rater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getUserRatings(userId: string, category?: 'skill' | 'course') {
    const where: any = {
      ratedId: userId,
    };

    if (category) {
      where.category = category;
    }

    const ratings = await this.prisma.rating.findMany({
      where,
      include: {
        rater: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        session: {
          select: {
            id: true,
            courseCode: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ratings;
  }

  async getUserRatingStats(userId: string, category?: 'skill' | 'course'): Promise<RatingStatsDto> {
    const where: any = {
      ratedId: userId,
    };

    if (category) {
      where.category = category;
    }

    const ratings = await this.prisma.rating.findMany({
      where,
      select: {
        rating: true,
      },
    });

    if (ratings.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((sum: number, r: any) => sum + r.rating, 0);
    const averageRating = sumRatings / totalRatings;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((r: any) => {
      ratingDistribution[r.rating as keyof typeof ratingDistribution]++;
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalRatings,
      ratingDistribution,
    };
  }

  async deleteRating(ratingId: string, raterId: string) {
    const rating = await this.prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new Error('Rating not found');
    }

    if (rating.raterId !== raterId) {
      throw new Error('You can only delete your own ratings');
    }

    return this.prisma.rating.delete({
      where: { id: ratingId },
    });
  }

  async canUserRateSession(raterId: string, sessionId: string): Promise<boolean> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return false;
    }

    // User can rate if they were either the teacher or learner in the session
    const canRate = session.teacherId === raterId || session.learnerId === raterId;
    
    if (!canRate) {
      return false;
    }

    // Check if they already rated this session
    const existingRating = await this.prisma.rating.findFirst({
      where: {
        raterId,
        sessionId,
      },
    });

    return !existingRating;
  }

  async getTopRatedUsers(category?: 'skill' | 'course', limit: number = 10) {
    const where: any = {};
    if (category) {
      where.category = category;
    }

    const topUsers = await this.prisma.rating.groupBy({
      by: ['ratedId'],
      where,
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
      having: {
        rating: {
          _count: {
            gte: 3, // At least 3 ratings to be considered
          },
        },
      },
      orderBy: {
        _avg: {
          rating: 'desc',
        },
      },
      take: limit,
    });

    // Get user details
    const userIds = topUsers.map((u: any) => u.ratedId);
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Combine data
    return topUsers.map((stats: any) => {
      const user = users.find(u => u.id === stats.ratedId);
      return {
        user,
        averageRating: Math.round((stats._avg.rating || 0) * 10) / 10,
        totalRatings: stats._count.rating,
      };
    });
  }
}