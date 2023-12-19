import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

import { FollowedShow } from './followed-show';
import { UserConfig } from './user-config';
import { WatchedEpisode } from './watched-episode';

@Entity()
export class User {
  @PrimaryColumn('uuid')
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

  @OneToOne(() => UserConfig)
  @JoinColumn()
  config: UserConfig;
}
