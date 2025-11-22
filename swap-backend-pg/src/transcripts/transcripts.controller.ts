import {
  Body, Controller, Post, UseInterceptors, UploadedFile, BadRequestException,
  Get, Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { IsEmail, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TranscriptsService } from './transcripts.service';

class IngestBody { 
  @IsEmail() email!: string;
  @IsString() filename!: string;
  @IsString() fileData!: string; // base64 encoded file
}

class IngestMultipartBody {
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

  /**
   * Preferred JSON upload endpoint used by swap-landing.
   * Accepts a base64-encoded PDF payload so we can bypass the Railway proxy limits.
   */
  @Post('upload')
  async upload(@Body() body: IngestBody) {
    console.log('[TRANSCRIPT] Request received - email:', body.email, 'filename:', body.filename);
    
    if (!body || !body.email) {
      console.error('[TRANSCRIPT] Missing email in body');
      throw new BadRequestException('Missing email in body');
    }
    if (!body.fileData) {
      console.error('[TRANSCRIPT] Missing file data');
      throw new BadRequestException('Missing file data');
    }

    try {
      // Decode base64 file data
      const base64Data = body.fileData.split(',')[1] || body.fileData;
      const buffer = Buffer.from(base64Data, 'base64');
      
      console.log('[TRANSCRIPT] File decoded - size:', buffer.length, 'bytes');
      
      // Create a mock Multer file object
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: body.filename,
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: buffer,
        size: buffer.length,
      } as Express.Multer.File;

      const result = await this.svc.processPdfTranscript(body.email, file);
      console.log('[TRANSCRIPT] Processing successful');
      return result;
    } catch (err: any) {
      console.error('[TRANSCRIPT] Processing failed:', err?.message);
      throw new BadRequestException(err?.message || 'Transcript processing failed');
    }
  }

  /**
   * Legacy multipart route kept for backward compatibility (older clients / dev tools).
   */
  @Post('ingest')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.includes('pdf')) {
        cb(new BadRequestException('Only PDF files are allowed'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  async ingest(@UploadedFile() file: Express.Multer.File, @Body() body: IngestMultipartBody) {
    if (!body?.email) {
      throw new BadRequestException('Missing email in body');
    }
    if (!file) {
      throw new BadRequestException('Missing file upload');
    }
    return this.svc.processPdfTranscript(body.email, file);
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
