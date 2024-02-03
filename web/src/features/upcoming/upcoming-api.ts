import { kyWrapper } from '@/lib/ky-wrapper';
import { EpisodeDto } from '@/types';

export const getUpcomingList = async (): Promise<EpisodeDto[]> => {
  const episodes: EpisodeDto[] = await kyWrapper.get('upcoming').json();
  return episodes;
};
