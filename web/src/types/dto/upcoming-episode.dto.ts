import type { ShowDto } from './show.dto';

export class UpcomingEpisodeDto {
  id?: string;
  name?: string;
  number?: number;
  seasonNumber?: number;
  aired?: Date;
  runtime?: number;
  summary?: string;
  show?: ShowDto;
}
