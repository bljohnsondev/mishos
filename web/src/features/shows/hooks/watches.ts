import { showSuccess, showWarning } from '@/components/notifications';
import { addWatch } from '@/features/shows';
import { EpisodeDto } from '@/types';

export const useWatched = () => {
  const markWatched = async (episode: EpisodeDto, watched: boolean, previous = false): Promise<void> => {
    // mark previous should only work when marking watched
    if (previous === true && watched === false) {
      showWarning('Mark previous is only for marking watched');
      return;
    }

    await addWatch(episode, watched, previous === true ? 'previous' : 'single');

    if (previous === true) {
      // flip the mark previous switch back so the user doesn't hit it again by accident
      showSuccess(`Episodes S${episode.seasonNumber}E${episode.number} and prior marked as watched`);
    } else {
      showSuccess(`Episode S${episode.seasonNumber}E${episode.number} marked as ${watched ? 'watched' : 'unwatched'}`);
    }
  };

  return { markWatched };
};
