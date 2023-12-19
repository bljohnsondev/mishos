import { axios } from '@/lib/axios';
import { EpisodeDto } from '@/types';

export const getWatchList = async (): Promise<EpisodeDto[]> => {
  const episodes: EpisodeDto[] = await axios.get('/watchlist');
  return episodes;
};
