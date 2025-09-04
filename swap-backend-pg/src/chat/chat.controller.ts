import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { IsEmail, IsOptional, IsString } from 'class-validator';

class EnsureThreadDto {
  @IsEmail() userEmail!: string;
  @IsEmail() otherEmail!: string;
}
class SendMessageDto {
  @IsString() threadId!: string;
  @IsEmail() senderEmail!: string;
  @IsString() text!: string;
}

@Controller('chat')
export class ChatController {
  constructor(private chat: ChatService) {}

  @Post('thread') ensureThread(@Body() dto: EnsureThreadDto) {
    return this.chat.ensureThread(dto.userEmail, dto.otherEmail);
  }

  @Get('threads') listThreads(@Query('email') email: string) {
    return this.chat.listThreads(email);
  }

  @Get('messages') listMessages(@Query('threadId') threadId: string, @Query('after') after?: string) {
    return this.chat.listMessages(threadId, after);
  }

  @Post('messages') send(@Body() dto: SendMessageDto) {
    return this.chat.sendMessage(dto.threadId, dto.senderEmail, dto.text);
  }
}
