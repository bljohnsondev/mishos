import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Show } from './show';
import { User } from './user';

@Entity()
export class FollowedShow {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, user => user.followedShows)
  user: User;

  @ManyToOne(() => Show)
  show: Show;

  @CreateDateColumn()
  createdAt?: Date;
}
