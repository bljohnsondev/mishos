import { axios } from '@/lib/axios';
import { EpisodeDto, SeasonDto, ShowDto } from '@/types';

export const getShowDetails = async (showId: string): Promise<ShowDto | undefined> => {
  const show: ShowDto | undefined = await axios.get(`/show/detail/${showId}`);
  return show;
};

export const getFollowedShows = async (): Promise<ShowDto[]> => {
  const followed: ShowDto[] | undefined = await axios.get('/show/followed');
  return followed ?? [];
};

export const getSeasons = async (show: ShowDto): Promise<SeasonDto[]> => {
  const seasons: SeasonDto[] | undefined = await axios.post('/show/seasons', {
    showId: show.id,
  });
  return seasons ?? [];
};

export const getEpisodesBySeason = async (season: SeasonDto): Promise<EpisodeDto[]> => {
  const episodes: EpisodeDto[] | undefined = await axios.post('/show/episodes', {
    seasonId: season.id,
  });
  return episodes ?? [];
};

export const addWatch = async (
  episode: EpisodeDto,
  isWatched: boolean,
  action: string | undefined
): Promise<boolean> => {
  const response: any = await axios.post('/show/watch', {
    episodeId: episode.id,
    isWatched,
    action: action ?? 'single',
  });
  return response?.watched === true;
};

export const followShow = async (providerId: string): Promise<ShowDto> => {
  return await axios.post('/show/add', { providerId: providerId.toString() });
};

export const unfollowShow = async (show: ShowDto): Promise<void> => {
  await axios.post('/show/unfollow', {
    showId: show.id,
  });
};

export const getProviderPreview = async (providerId: string): Promise<ShowDto> => {
  return await axios.get(`/show/preview/${providerId}`);
};
