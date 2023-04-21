import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailService } from 'src/services/mail/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/auth.entity';
import { Token } from './token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  controllers: [EmailController],
  providers: [EmailService, MailService],
})
export class EmailModule {}
