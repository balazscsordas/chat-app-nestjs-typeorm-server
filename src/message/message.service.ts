import { Injectable } from '@nestjs/common';
import { Message } from './message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendMessageDto } from './dto/sendMessage.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async getMessages(user_id: number, partner_id: number) {
    try {
      const messages = await this.messageRepository
        .createQueryBuilder('message')
        .select()
        .where(
          'message.sender_id = :user_id AND message.receiver_id = :partner_id',
          {
            user_id,
            partner_id,
          },
        )
        .orWhere(
          'message.sender_id = :partner_id AND message.receiver_id = :user_id',
          {
            user_id,
            partner_id,
          },
        )
        .getMany();
      return messages;
    } catch (err) {
      console.log(err);
    }
  }

  async sendMessage(user_id: number, body: SendMessageDto) {
    const { partner_id, message } = body;
    try {
      const messageToSave = {
        message,
        sender_id: user_id,
        receiver_id: partner_id,
      };
      const savedMessage = await this.messageRepository.save(messageToSave);
      return savedMessage;
    } catch (err) {
      console.log(err);
    }
  }
}
