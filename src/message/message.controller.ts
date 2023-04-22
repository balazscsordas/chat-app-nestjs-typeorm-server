import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { Request } from 'express';
import { SendMessageDto } from './dto/sendMessage.dto';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}
  @Get('')
  async getMessages(
    @Req() req: Request,
    @Query('partner_id') partner_id: number,
  ) {
    const user_id = req['user_id'];
    return await this.messageService.getMessages(user_id, partner_id);
  }

  @Post('send')
  async sendMessage(@Req() req: Request, @Body() body: SendMessageDto) {
    console.log(body);
    const user_id = req['user_id'];
    return await this.messageService.sendMessage(user_id, body);
  }
}
