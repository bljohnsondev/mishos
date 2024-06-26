import type { ShowDto } from '@/types/dto/show.dto';

export interface EpisodeDto {
  id?: string;
  name?: string;
  number?: number;
  type?: string;
  aired?: Date;
  runtime?: number;
  summary?: string;
  createdAt?: Date;
  watched?: boolean;
  watchedDate?: Date;
  seasonNumber?: number;
  show?: ShowDto;
}
