import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Season } from './season';

@Entity()
export class Show {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  providerId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  providerUrl?: string;

  @Column({ nullable: true, length: 4096 })
  summary?: string;

  @Column({ nullable: true })
  language?: string;

  @Column({ nullable: true })
  status?: string;

  @Column({ nullable: true })
  runtime?: number;

  @Column({ nullable: true })
  premiered?: Date;

  @Column({ nullable: true })
  ended?: Date;

  @Column({ nullable: true })
  officialSite?: string;

  @Column({ nullable: true })
  network?: string;

  @Column({ nullable: true })
  imageMedium?: string;

  @Column({ nullable: true })
  imageOriginal?: string;

  @Column({ nullable: true })
  imdbId?: string;

  @OneToMany(() => Season, season => season.show, {
    cascade: true,
  })
  seasons?: Season[];

  @CreateDateColumn()
  createdAt?: Date;
}
