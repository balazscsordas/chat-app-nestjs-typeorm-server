import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}

  async getRoomsByUserId(user_id: number) {
    try {
      const rooms = await this.roomRepository
        .createQueryBuilder('rooms')
        .leftJoinAndSelect('rooms.users', 'users')
        .where('user.id = :user_id', { user_id: user_id })
        .getMany();
      if (!rooms || rooms.length == 0) throw new NotFoundException();
    } catch (err) {
      console.log(err);
      if (err.status == 404) {
        throw new HttpException(
          `There isnt any rooms for user with id: ${user_id}`,
          HttpStatus.NO_CONTENT,
        );
      } else {
        throw new HttpException(
          `Serverside error occured.`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
