import { kyWrapper } from '@/lib/ky-wrapper';
import { FollowShowResponseDto, ShowDto } from '@/types';

export const getFollowedShows = async (): Promise<ShowDto[]> => {
  const response: any = await kyWrapper.get('show/followed').json();
  return response ? response.followedShows : [];
};

export const getShowDetails = async (showId: string): Promise<ShowDto | undefined> => {
  //const show: ShowDto | undefined = await kyWrapper.get(`show/view/${showId}`).json();
  const response: any = await kyWrapper.get(`show/view/${showId}`).json();
  return response.show as ShowDto;
};

export const watchEpisode = async (episodeId: number, watch: boolean, previous: boolean = false) => {
  // toggle previous should only apply when marking watched
  if (watch && previous) {
    const response: any = await kyWrapper.post('episode/watchprevious', {
      json: {
        episodeId,
      },
    });
    return response?.watched === true;
  } else {
    const response: any = await kyWrapper.post(watch ? 'episode/watch' : 'episode/unwatch', {
      json: {
        episodeId,
      },
    });
    return response?.watched === true;
  }
};

export const getProviderPreview = async (providerId: string): Promise<ShowDto> => {
  const response: any = await kyWrapper.get(`show/preview/${providerId}`).json();
  return response.show as ShowDto;
};

export const followShow = async (providerId: string): Promise<FollowShowResponseDto | undefined> => {
  const response: any = await kyWrapper
    .post('show/add', {
      json: {
        providerId: providerId.toString(),
      },
    })
    .json();

  return {
    id: response?.show?.id,
    name: response?.show?.name,
  };
};

export const unfollowShow = async (show: ShowDto): Promise<void> => {
  await kyWrapper.post('show/unfollow', {
    json: {
      showId: show.id,
    },
  });
};

export const refreshShow = async (showId: string): Promise<void> => {
  await kyWrapper.get(`show/update/${showId}`);
};
