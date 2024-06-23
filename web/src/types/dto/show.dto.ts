import type { SeasonDto } from './season.dto';

export interface ShowDto {
  id?: string;
  providerId?: string;
  name?: string;
  providerUrl?: string;
  summary?: string;
  language?: string;
  status?: string;
  runtime?: number;
  premiered?: Date;
  ended?: Date;
  officialSite?: string;
  network?: string;
  imageMedium?: string;
  imageOriginal?: string;
  imdbId?: string;
  createdAt?: Date;
  added?: boolean;
  seasons?: SeasonDto[];
  // added for client side only
  following?: boolean;
  completed?: number;
}
