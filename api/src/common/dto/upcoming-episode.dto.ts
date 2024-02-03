import { ShowDto } from './show.dto';

export class UpcomingEpisodeDto {
  id?: string;
  name?: string;
  number?: number;
  seasonNumber?: number;
  aired?: Date;
  summary?: string;
  show?: ShowDto;
}
