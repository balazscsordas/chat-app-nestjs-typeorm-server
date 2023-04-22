import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/auth.entity';
import { Message } from 'src/message/message.entity';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUsers(user_id: number) {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .distinct(true)
        .select(['user.id', 'user.first_name', 'user.last_name'])
        .innerJoin(
          Message,
          'message',
          'message.sender_id = user.id OR message.receiver_id = user.id',
        )
        .where(
          '(message.sender_id = :user_id OR message.receiver_id = :user_id)',
          { user_id },
        )
        .andWhere('user.id != :user_id', { user_id })
        .getMany();
      if (!users || users.length == 0) throw new NotFoundException();
      return users;
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

  async getFilteredUsers(user_id: number, filter: string) {
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
        .andWhere('user.id != :user_id', { user_id })
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
