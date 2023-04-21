import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const url = `${process.env.CLIENT_URL}/set-new-password/${token}`;
    await this.mailerService.sendMail({
      to,
      subject: 'Reset your password',
      html: `Hi,<br/><br/> Click <a href="${url}">here</a> to reset your password. <br/><br/> Booklet Team`,
    });
  }
}
