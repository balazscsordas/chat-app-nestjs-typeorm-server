import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/auth.entity';
import { MailService } from 'src/services/mail/mail.service';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async sendNewPasswordLink(email: string) {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { email },
      });
      if (!foundUser) {
        throw new UnauthorizedException();
      }
      const jwtPayload = { email: foundUser.email, user_id: foundUser.id };
      const resetPasswordToken = await this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      });
      const foundToken = await this.tokenRepository.findOne({
        where: { user: foundUser },
      });
      if (!foundToken) {
        const tokenToSave = this.tokenRepository.create({
          resetPasswordToken,
          user: foundUser,
        });
        const savedToken = await this.tokenRepository.save(tokenToSave);
        if (!savedToken) {
          throw new InternalServerErrorException();
        }
      } else {
        await this.tokenRepository.update(
          { id: foundToken.id },
          { resetPasswordToken },
        );
      }
      await this.mailService.sendPasswordResetEmail(email, resetPasswordToken);
      return { message: 'Email has been sent' };
    } catch (err) {
      console.log(err);
      if (err.status == 401) {
        throw new HttpException(
          'There isnt any user with this email.',
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          `Serverside error occured, please try again later.`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async verifyNewPasswordToken(resetPasswordToken: string) {
    try {
      const foundToken = await this.tokenRepository.findOne({
        where: { resetPasswordToken },
      });
      if (!foundToken) {
        throw new UnauthorizedException();
      }
      const payload = await this.jwtService.verifyAsync(resetPasswordToken, {
        secret: process.env.JWT_SECRET,
      });
      return { user_id: payload.user_id };
    } catch (err) {
      console.log(err);
      if (err.status == 401) {
        throw new HttpException(
          'There isnt any user with this email.',
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          `Serverside error occured, please try again later.`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async setNewPassword(newPassword: string, token: string) {
    try {
      const foundToken = await this.tokenRepository.findOne({
        where: { resetPasswordToken: token },
      });
      if (!foundToken) {
        throw new UnauthorizedException();
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const salt = await bcrypt.genSalt();
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      await this.userRepository.update(
        { id: payload.user_id },
        { password: hashedNewPassword },
      );
      await this.tokenRepository.delete({ id: foundToken.id });
      return { message: 'Password has been updated' };
    } catch (err) {
      console.log(err);
      if (err.status == 401) {
        throw new HttpException(
          'Your token has expired.',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        throw new HttpException(
          `Serverside error occured, please try again later.`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
