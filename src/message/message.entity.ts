import { User } from 'src/auth/auth.entity';
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
  message: string;

  @Column()
  sender_id: number;

  @Column()
  receiver_id: number;

  @ManyToOne(() => User, user => user.sent_messages)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, user => user.received_messages)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;
}
