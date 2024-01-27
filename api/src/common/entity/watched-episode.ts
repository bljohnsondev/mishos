import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Episode } from './episode';
import { User } from './user';

@Entity()
@Unique(['user', 'episode'])
export class WatchedEpisode {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, user => user.watchedEpisodes, { nullable: false })
  user: User;

  @ManyToOne(() => Episode, { nullable: false })
  episode: Episode;

  @CreateDateColumn()
  createdAt?: Date;
}
