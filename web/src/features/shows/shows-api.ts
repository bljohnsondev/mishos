import { kyWrapper } from '@/lib/ky-wrapper';
import { ShowDto } from '@/types';

export const getFollowedShows = async (): Promise<ShowDto[]> => {
  const followed: ShowDto[] | undefined = await kyWrapper.get('show/followed').json();
  return followed ?? [];
};

export const getShowDetails = async (showId: string): Promise<ShowDto | undefined> => {
  const show: ShowDto | undefined = await kyWrapper.get(`show/detail/${showId}`).json();
  return show;
};

export const addWatch = async (episodeId: string, isWatched: boolean, action: string | undefined) => {
  const response: any = await kyWrapper
    .post('show/watch', {
      json: {
        episodeId: episodeId,
        isWatched,
        action: action ?? 'single',
      },
    })
    .json();
  return response?.watched === true;
};

export const getProviderPreview = async (providerId: string): Promise<ShowDto> => {
  return await kyWrapper.get(`show/preview/${providerId}`).json();
};

export const followShow = async (providerId: string): Promise<ShowDto> => {
  return await kyWrapper
    .post('show/add', {
      json: {
        providerId: providerId.toString(),
      },
    })
    .json();
};

export const unfollowShow = async (show: ShowDto): Promise<void> => {
  await kyWrapper.post('show/unfollow', {
    json: {
      showId: show.id,
    },
  });
};
