import { kyWrapper } from '@/lib/ky-wrapper';
import { EpisodeDto } from '@/types';

export const getWatchList = async (): Promise<EpisodeDto[]> => {
  const episodes: EpisodeDto[] = await kyWrapper.get('watchlist').json();
  return episodes;
};
