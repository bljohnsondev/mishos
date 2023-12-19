import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  notifierTimezone: string;

  @Column({ nullable: true })
  notifierUrl: string;
}
