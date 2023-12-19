import { EpisodeDto } from './episode.dto';

export class SeasonDto {
  id?: string;
  providerId?: string;
  number?: number;
  premiered?: Date;
  ended?: Date;
  network?: string;
  episodeOrder?: number;
  createdAt?: Date;
  episodes?: EpisodeDto[];
}
