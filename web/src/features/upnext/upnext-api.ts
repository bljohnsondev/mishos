import { kyWrapper } from '@/lib/ky-wrapper';
import { EpisodeDto } from '@/types';

export const getUpNextList = async (): Promise<EpisodeDto[]> => {
  const episodes: EpisodeDto[] = await kyWrapper.get('upnext').json();
  return episodes;
};
