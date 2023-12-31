import { ShowDto } from './show.dto';

export class UpNextEpisodeDto {
  id?: string;
  name?: string;
  number?: number;
  seasonNumber?: number;
  aired?: Date;
  show?: ShowDto;
}
