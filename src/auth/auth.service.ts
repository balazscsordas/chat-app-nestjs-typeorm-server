import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './auth.entity';
import { CredentialsDto } from './dto/Credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(credentials: CredentialsDto) {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { email: credentials.email },
      });
      if (!foundUser) {
        throw new UnauthorizedException();
      }
      const isMatch = await bcrypt.compare(
        credentials.password,
        foundUser.password,
      );
      if (!isMatch) {
        throw new UnauthorizedException();
      }
      const jwtPayload = { email: foundUser.email, user_id: foundUser.id };
      const userToken = await this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET,
      });
      return userToken;
    } catch (err) {
      /* console.log(err); */
      if (err.status == 401) {
        throw new HttpException('Wrong credentials.', HttpStatus.UNAUTHORIZED);
      } else {
        throw new HttpException(
          `Serverside error occured, please try again later.`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async register(credentials: CredentialsDto) {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { email: credentials.email },
      });
      if (foundUser) {
        throw new ConflictException();
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(credentials.password, salt);
      const newUser: CredentialsDto = {
        first_name: credentials.first_name,
        last_name: credentials.last_name,
        email: credentials.email,
        password: hashedPassword,
      };
      const userToSave = this.userRepository.create({ ...newUser });
      const savedUser = await this.userRepository.save(userToSave);
      if (!savedUser) {
        throw new InternalServerErrorException();
      }
      return { message: 'Registered' };
    } catch (err) {
      console.log(err);
      if (err.status == 409) {
        throw new HttpException(
          'User already exists, please sign in.',
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
}
