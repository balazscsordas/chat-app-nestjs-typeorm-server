import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/auth.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth/auth.guard';
import { MailService } from './services/mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';
import { Token } from './email/token.entity';
import { RoomController } from './room/room.controller';
import { RoomService } from './room/room.service';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Room } from './room/room.entity';
import { Message } from './message/message.entity';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PW,
      database: process.env.DB,
      entities: [User, Room, Message, Token],
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1w' },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PW,
        },
      },
    }),
    AuthModule,
    EmailModule,
    RoomModule,
  ],
  controllers: [AppController, MessageController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    MailService,
    MessageService,
  ],
})
export class AppModule {}