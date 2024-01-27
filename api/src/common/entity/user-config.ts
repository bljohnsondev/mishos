import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserConfig {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  notifierTimezone: string;

  @Column({ nullable: true })
  notifierUrl: string;
}
