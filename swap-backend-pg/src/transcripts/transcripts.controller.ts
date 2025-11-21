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
      console.log('[TRANSCRIPT] File filter - mimetype:', file.mimetype, 'originalname:', file.originalname);
      if (!file.mimetype.includes('pdf')) {
        cb(new BadRequestException('Only PDF files are allowed'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  async ingest(@UploadedFile() file: Express.Multer.File, @Body() body: IngestBody) {
    console.log('[TRANSCRIPT] Request received - file:', !!file, 'body:', body);
    console.log('[TRANSCRIPT] File details:', file ? { 
      fieldname: file.fieldname, 
      originalname: file.originalname, 
      mimetype: file.mimetype,
      size: file.size 
    } : 'NO FILE');
    
    if (!body || !body.email) {
      console.error('[TRANSCRIPT] Missing email in body');
      throw new BadRequestException('Missing email in body');
    }
    if (!file) {
      console.error('[TRANSCRIPT] Missing file upload');
      throw new BadRequestException('Missing file upload');
    }

    try {
      const result = await this.svc.processPdfTranscript(body.email, file);
      console.log('[TRANSCRIPT] Processing successful');
      return result;
    } catch (err: any) {
      console.error('[TRANSCRIPT] Processing failed:', err?.message);
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
