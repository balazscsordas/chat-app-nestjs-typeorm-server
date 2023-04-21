import { User } from 'src/auth/auth.entity';
import { Room } from 'src/room/room.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  room_id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, user => user.messages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Room, room => room.messages)
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
