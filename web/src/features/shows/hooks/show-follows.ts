import { showSuccess } from '@/components/notifications';
import { ShowDto } from '@/types';

import { followShow as apiFollowShow, unfollowShow as apiUnfollowShow } from '../api/api-shows';

export const useShowFollows = () => {
  const followShow = async (show: ShowDto): Promise<ShowDto | undefined> => {
    if (show.providerId) {
      // a follow will return a ShowDto with id populated
      const showFromApi: ShowDto = await apiFollowShow(show.providerId);
      showSuccess(`You have added ${showFromApi.name}`);
      return showFromApi;
    }
  };

  const unfollowShow = async (show: ShowDto): Promise<void> => {
    await apiUnfollowShow(show);
    showSuccess(`You have removed ${show.name}`);
  };

  return { followShow, unfollowShow };
};
