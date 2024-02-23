import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Season } from './season';
import { WatchedEpisode } from './watched-episode';

@Entity()
export class Episode {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  providerId: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  number?: number;

  @Column({ nullable: true })
  type?: string;

  @Column({ nullable: true })
  aired?: Date;

  @Column({ nullable: true })
  runtime?: number;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @ManyToOne(() => Season, season => season.episodes)
  season?: Season;

  @OneToMany(() => WatchedEpisode, watchedEpisode => watchedEpisode.episode)
  watches?: WatchedEpisode[];

  @CreateDateColumn()
  createdAt?: Date;
}
