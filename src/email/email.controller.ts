import { Body, Controller, Post } from '@nestjs/common';
import { PublicRoute } from 'src/decorators/public-route.decorator';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @PublicRoute()
  @Post('SendNewPasswordLink')
  async resetPassword(@Body() body: { email: string }) {
    return await this.emailService.sendNewPasswordLink(body.email);
  }

  @PublicRoute()
  @Post('VerifyNewPasswordToken')
  async verifyNewPasswordToken(@Body() body: { token: string }) {
    return await this.emailService.verifyNewPasswordToken(body.token);
  }

  @PublicRoute()
  @Post('SetNewPassword')
  async setNewPassword(@Body() body: { newPassword: string; token: string }) {
    return await this.emailService.setNewPassword(body.newPassword, body.token);
  }
}
