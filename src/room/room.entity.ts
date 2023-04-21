import { User } from 'src/auth/auth.entity';
import { Message } from 'src/message/message.entity';
import { Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Message, message => message.room)
  messages: Message[];

  @ManyToMany(() => User, user => user.rooms)
  users: User[];
}
