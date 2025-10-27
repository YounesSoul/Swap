import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RatingService, CreateRatingDto } from './ratings.service';

export interface CreateRatingRequestDto {
  raterId: string;
  ratedId: string;
  sessionId?: string;
  rating: number;
  review?: string;
  category: 'skill' | 'course';
  skillOrCourse: string;
}

export interface UpdateRatingRequestDto {
  rating: number;
  review?: string;
}

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async createRating(@Body() createRatingDto: CreateRatingRequestDto) {
    try {
      const rating = await this.ratingService.createRating(createRatingDto);
      return {
        success: true,
        data: rating,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  async updateRating(
    @Param('id') ratingId: string,
    @Body() updateRatingDto: UpdateRatingRequestDto,
    @Query('raterId') raterId: string,
  ) {
    try {
      const rating = await this.ratingService.updateRating(
        ratingId,
        raterId,
        updateRatingDto,
      );
      return {
        success: true,
        data: rating,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('user/:userId')
  async getUserRatings(
    @Param('userId') userId: string,
    @Query('category') category?: 'skill' | 'course',
  ) {
    try {
      const ratings = await this.ratingService.getUserRatings(userId, category);
      return {
        success: true,
        data: ratings,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/:userId/stats')
  async getUserRatingStats(
    @Param('userId') userId: string,
    @Query('category') category?: 'skill' | 'course',
  ) {
    try {
      const stats = await this.ratingService.getUserRatingStats(userId, category);
      return {
        success: true,
        data: stats,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteRating(
    @Param('id') ratingId: string,
    @Query('raterId') raterId: string,
  ) {
    try {
      await this.ratingService.deleteRating(ratingId, raterId);
      return {
        success: true,
        message: 'Rating deleted successfully',
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('session/:sessionId/can-rate')
  async canUserRateSession(
    @Param('sessionId') sessionId: string,
    @Query('raterId') raterId: string,
  ) {
    try {
      const canRate = await this.ratingService.canUserRateSession(raterId, sessionId);
      return {
        success: true,
        data: { canRate },
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('top-rated')
  async getTopRatedUsers(
    @Query('category') category?: 'skill' | 'course',
    @Query('limit') limit?: string,
  ) {
    try {
      const limitNumber = limit ? parseInt(limit, 10) : 10;
      const topUsers = await this.ratingService.getTopRatedUsers(category, limitNumber);
      return {
        success: true,
        data: topUsers,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('session/:sessionId/exists')
  async sessionRatingExists(
    @Param('sessionId') sessionId: string,
    @Query('raterId') raterId: string,
  ) {
    try {
      if (!raterId) {
        throw new HttpException(
          {
            success: false,
            error: 'raterId query parameter is required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const exists = await this.ratingService.sessionRatingExists(sessionId, raterId);
      return {
        success: true,
        exists,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}