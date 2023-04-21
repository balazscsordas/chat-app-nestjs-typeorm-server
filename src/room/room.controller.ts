import { Controller, Get, Req, Query } from '@nestjs/common';
import { RoomService } from './room.service';
import { Request } from 'express';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get()
  async getRoomsByUserId(@Req() req: Request) {
    const user_id = req['user_id'];
    return this.roomService.getRoomsByUserId(user_id);
  }

  @Get('filtered-users')
  async getFilteredUsers(@Query('filter') filter: string) {
    return this.roomService.getFilteredUsers(filter);
  }
}
