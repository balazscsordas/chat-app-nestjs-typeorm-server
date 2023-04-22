import { Message } from 'src/message/message.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => Message, message => message.sender)
  sent_messages: Message[];

  @OneToMany(() => Message, message => message.receiver)
  received_messages: Message[];
}
