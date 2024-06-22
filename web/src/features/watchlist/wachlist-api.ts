import { kyWrapper } from '@/lib/ky-wrapper';
import type { WatchlistEpisodeDto } from '@/types';

export const getWatchList = async (): Promise<WatchlistEpisodeDto[]> => {
  //const episodes: EpisodeDto[] = await kyWrapper.get('watchlist').json();
  const episodes: any = await kyWrapper.get('watchlist/unwatched').json();
  return episodes.unwatched;
};

export const getWatchListRecent = async (): Promise<WatchlistEpisodeDto[]> => {
  const episodes: any = await kyWrapper.get('watchlist/recent').json();
  return episodes.recent;
};
