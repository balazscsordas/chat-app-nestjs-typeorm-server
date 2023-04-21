import { User } from 'src/auth/auth.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resetPasswordToken: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
