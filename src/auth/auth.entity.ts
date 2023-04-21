import { Message } from 'src/message/message.entity';
import { Room } from 'src/room/room.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Message, message => message.user_id)
  messages: Message[];

  @ManyToMany(() => Room, room => room.users)
  rooms: Room[];
}
