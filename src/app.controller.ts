import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicRoute } from './decorators/public-route.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @PublicRoute()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
