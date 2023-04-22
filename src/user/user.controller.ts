import { Controller, Get, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getRoomsByUserId(@Req() req: Request) {
    const user_id = req['user_id'];
    return await this.userService.getUsers(user_id);
  }

  @Get('filtered-users')
  async getFilteredUsers(@Query('filter') filter: string, @Req() req: Request) {
    const user_id = req['user_id'];
    return await this.userService.getFilteredUsers(user_id, filter);
  }
}
