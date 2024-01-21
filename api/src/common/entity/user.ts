import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { FollowedShow } from './followed-show';
import { UserConfig } from './user-config';
import { WatchedEpisode } from './watched-episode';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => FollowedShow, followedShow => followedShow.user, {
    cascade: true,
  })
  followedShows?: FollowedShow[];

  @OneToMany(() => WatchedEpisode, watchedEpisode => watchedEpisode.user, {
    cascade: true,
  })
  watchedEpisodes?: WatchedEpisode[];

  @OneToOne(() => UserConfig, {
    cascade: true,
  })
  @JoinColumn()
  config: UserConfig;
}
