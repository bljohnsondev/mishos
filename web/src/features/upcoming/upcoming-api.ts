import { kyWrapper } from '@/lib/ky-wrapper';
import { WatchlistEpisodeDto } from '@/types';

export const getUpcomingList = async (): Promise<WatchlistEpisodeDto[]> => {
  const episodes: any = await kyWrapper.get('watchlist/upcoming').json();
  return episodes.upcoming;
};
