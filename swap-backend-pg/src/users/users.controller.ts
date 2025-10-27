import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SkillDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}

class CourseDto {
  @IsString()
  code!: string;

  @IsOptional()
  @IsString()
  grade?: string; // e.g., "A" | "A+"
}

class OnboardDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  skills!: SkillDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseDto)
  courses!: CourseDto[];
}

// Simple body DTOs for mutations
class EmailDto {
  @IsEmail()
  email!: string;
}
class AddSkillBody extends EmailDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}
class RemoveSkillBody extends EmailDto {
  @IsString()
  name!: string;
}
class AddCourseBody extends EmailDto {
  @IsString()
  code!: string;

  @IsOptional()
  @IsString()
  grade?: string;
}
class RemoveCourseBody extends EmailDto {
  @IsString()
  code!: string;
}

class UpsertUserDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('profile')
  profile(@Query('email') email: string) {
    return this.users.profile(email);
  }

  @Post('upsert')
  upsertUser(@Body() dto: UpsertUserDto) {
    return this.users.upsertByEmail(
      dto.email,
      dto.name,
      dto.university,
      dto.timezone,
      dto.image,
    );
  }

  @Post('onboarding')
  onboarding(@Body() dto: OnboardDto) {
    const skills = (dto.skills || []).map((s) => ({
      name: s.name,
      level: (s.level || 'ADVANCED') as any,
    }));
    const courses = (dto.courses || []).map((c) => ({
      code: c.code,
      grade: c.grade || 'A',
    }));
    return this.users.onboarding({
      email: dto.email,
      name: dto.name,
      skills,
      courses,
    });
  }

  // ---------- NEW: Skills ----------
  @Post('skills/add')
  addSkill(@Body() body: AddSkillBody) {
    const level = (body.level || 'ADVANCED') as any;
    return this.users.addSkill(body.email, body.name, level);
  }

  @Post('skills/remove')
  removeSkill(@Body() body: RemoveSkillBody) {
    return this.users.removeSkill(body.email, body.name);
  }

  // ---------- NEW: Courses ----------
  @Post('courses/add')
  addCourse(@Body() body: AddCourseBody) {
    // service uppercases the code; ok to pass as is
    return this.users.addCourse(body.email, body.code, body.grade || 'A');
  }

  @Post('courses/remove')
  removeCourse(@Body() body: RemoveCourseBody) {
    return this.users.removeCourse(body.email, body.code);
  }
}
