import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicRoute } from 'src/decorators/public-route.decorator';
import { CredentialsDto } from './dto/Credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @Post('Login')
  async login(@Body() credentials: CredentialsDto) {
    const userToken = await this.authService.login(credentials);
    return { userToken };
  }

  @PublicRoute()
  @Post('Registration')
  async register(@Body() credentials: CredentialsDto) {
    return await this.authService.register(credentials);
  }
}
