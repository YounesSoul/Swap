import {
  Body, Controller, Post, UseInterceptors, UploadedFile, BadRequestException,
  Get, Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { IsEmail, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TranscriptsService } from './transcripts.service';

class IngestBody { 
  @IsEmail() email!: string; 
}

class GetTranscriptsQuery {
  @IsEmail() email!: string;
}

class CourseDto {
  @IsString() code!: string;
  @IsString() grade!: string;
}

class AddSelectedCoursesBody {
  @IsEmail() email!: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseDto)
  courses!: CourseDto[];
}

@Controller('transcripts')
export class TranscriptsController {
  constructor(private svc: TranscriptsService) {}

  @Post('ingest')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.includes('pdf')) {
        cb(new BadRequestException('Only PDF files are allowed'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  async ingest(@UploadedFile() file: Express.Multer.File, @Body() body: IngestBody) {
    if (!body || !body.email) {
      throw new BadRequestException('Missing email in body');
    }
    if (!file) {
      throw new BadRequestException('Missing file upload');
    }

    try {
      return await this.svc.processPdfTranscript(body.email, file);
    } catch (err: any) {
      // surface useful error messages for the client (avoid leaking internals)
      throw new BadRequestException(err?.message || 'Transcript processing failed');
    }
  }

  @Get('history')
  async getTranscriptHistory(@Query() query: GetTranscriptsQuery) {
    if (!query.email) {
      throw new BadRequestException('Email parameter is required');
    }
    return await this.svc.getTranscriptHistory(query.email);
  }

  @Get('courses')
  async getUserCourses(@Query() query: GetTranscriptsQuery) {
    if (!query.email) {
      throw new BadRequestException('Email parameter is required');
    }
    return await this.svc.getUserCourses(query.email);
  }

  @Post('add-selected-courses')
  async addSelectedCourses(@Body() body: AddSelectedCoursesBody) {
    if (!body.email || !body.courses || !Array.isArray(body.courses)) {
      throw new BadRequestException('Email and courses array are required');
    }
    return await this.svc.addSelectedCourses(body.email, body.courses);
  }
}
