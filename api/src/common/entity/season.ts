import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Episode } from './episode';
import { Show } from './show';

@Entity()
export class Season {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  providerId: string;

  @Column()
  number: number;

  @Column({ nullable: true })
  premiered?: Date;

  @Column({ nullable: true })
  ended?: Date;

  @Column({ nullable: true })
  network?: string;

  @Column({ nullable: true })
  episodeOrder?: number;

  @ManyToOne(() => Show, show => show.seasons)
  show?: Show;

  @OneToMany(() => Episode, episode => episode.season, {
    cascade: true,
  })
  episodes?: Episode[];

  @CreateDateColumn()
  createdAt?: Date;
}
