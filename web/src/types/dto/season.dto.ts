import type { EpisodeDto } from './episode.dto';

export interface SeasonDto {
  id?: string;
  number?: number;
  premiered?: Date;
  ended?: Date;
  network?: string;
  episodeOrder?: number;
  createdAt?: Date;
  episodes?: EpisodeDto[];
}
