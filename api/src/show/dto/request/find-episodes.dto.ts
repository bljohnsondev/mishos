import { IsNotEmpty } from 'class-validator';

export class FindEpisodesDto {
  @IsNotEmpty()
  seasonId: string;
}
