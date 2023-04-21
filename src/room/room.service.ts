import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { Brackets, Repository } from 'typeorm';
import { User } from 'src/auth/auth.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(User) private userRepository: Repository<User>,
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

  async getFilteredUsers(filter: string) {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .select()
        .where(
          new Brackets(qb => {
            if (filter) {
              qb.where('user.first_name LIKE :filter', {
                filter: `%${filter}%`,
              }).orWhere('user.last_name LIKE :filter', {
                filter: `%${filter}%`,
              });
            }
          }),
        )
        .take(20)
        .getMany();
      return users;
    } catch (err) {
      console.log(err);
      if (err.status == 404) {
        throw new HttpException(
          `There isnt any rooms for user with id:`,
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
