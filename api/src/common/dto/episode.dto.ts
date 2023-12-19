import { ShowDto } from './show.dto';

export class EpisodeDto {
  id?: string;
  providerId?: string;
  name?: string;
  number?: number;
  type?: string;
  aired?: Date;
  runtime?: number;
  summary?: string;
  createdAt?: Date;
  watched?: boolean;
  seasonNumber?: number;
  show?: ShowDto;
}
