export interface WatchlistEpisodeDto {
  id: number;
  name: string;
  summary?: string;
  number: number;
  aired?: Date;
  runtime?: number;
  showId: number;
  showName: string;
  imageMedium?: string;
  network?: string;
  seasonNumber: number;
  watchedDate?: Date;
}
