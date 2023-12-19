import clsx from 'clsx';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { IoEye, IoEyeOff } from 'react-icons/io5';

import { EpisodeDto } from '@/types';
import { formatDate } from '@/utils';

dayjs.extend(isSameOrBefore);

interface EpisodeDisplayProps {
  image?: boolean;
  showName?: boolean;
}

interface EpisodeListProps {
  episodes: EpisodeDto[];
  seasonNumber?: number;
  display?: EpisodeDisplayProps;
  emptyMessage?: string;
  onClickWatched: (episode: EpisodeDto, watched: boolean) => void;
  onClickImage?: ((episode: EpisodeDto) => void) | undefined;
}

export const EpisodeList = ({
  episodes,
  seasonNumber,
  display = {},
  emptyMessage,
  onClickWatched,
  onClickImage,
}: EpisodeListProps) => {
  const hasAired = (episode: EpisodeDto) => {
    return dayjs(episode.aired).isSameOrBefore(dayjs());
  };

  return episodes && episodes.length > 0 ? (
    <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
      {episodes.map(episode => (
        <li
          key={episode.id || episode.number}
          className="border rounded-lg p-3 text-sm border-neutral-500 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div className="flex items-start gap-3">
            {display.image && episode.show && episode.show.imageMedium && (
              <div className="grow-0 shrink-0 basis-[80px] flex flex-col gap-2">
                {onClickImage ? (
                  <button onClick={() => onClickImage(episode)}>
                    <ShowThumbnail episode={episode} />
                  </button>
                ) : (
                  <ShowThumbnail episode={episode} />
                )}
              </div>
            )}
            <div className="flex flex-col gap-1 grow">
              {display.showName && episode.show && episode.show.name && (
                <div className="text-neutral-800 dark:text-neutral-300 border border-sky-800 bg-sky-400/[0.2] py-1 px-2 rounded">
                  {episode.show.name}
                </div>
              )}
              <div className="text-amber-800 dark:text-neutral-400 flex items-center">
                <div>
                  S{episode.seasonNumber ?? seasonNumber} E{episode.number}
                </div>
                {episode.aired && (
                  <span className="ml-auto text-neutral-600 dark:text-neutral-400">{formatDate(episode.aired)}</span>
                )}
              </div>
              <div>{episode.name}</div>
              {episode.id && (
                <div>
                  {hasAired(episode) ? (
                    <WatchButton
                      watched={!!episode.watched}
                      onClick={() => onClickWatched(episode, !episode.watched)}
                    />
                  ) : (
                    <div className="h-10 flex items-center justify-start text-xs text-neutral-600 dark:text-neutral-400">
                      Upcoming episode
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <div className="p-3 rounded-lg border border-neutral-800 text-neutral-500">
      {emptyMessage ?? 'No episodes available for this show or season'}
    </div>
  );
};

interface ShowThumbnailProps {
  episode: EpisodeDto;
}

const ShowThumbnail = ({ episode }: ShowThumbnailProps) => {
  return episode.show ? (
    <img
      src={episode.show.imageMedium ?? '/images/empty-medium.jpg'}
      alt={episode.show.name}
      className="object-contain rounded-lg"
    />
  ) : null;
};

interface WatchButtonProps {
  watched: boolean;
  onClick: () => void;
}

const WatchButton = ({ watched, onClick }: WatchButtonProps) => {
  return (
    <button
      className={clsx(
        'w-full max-w-full md:max-w-fit h-12 md:h-fit rounded md:text-xs flex items-center justify-center md:justify-start gap-2 mt-1 p-2 border transform transition duration-150',
        watched
          ? 'bg-green-800 text-neutral-200 border-green-700 dark:text-neutral-300 dark:border-green-700 dark:bg-green-800 dark:hover:bg-green-900'
          : 'border-neutral-500 bg-transparent hover:bg-neutral-400 dark:text-neutral-400 dark:border-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700'
      )}
      onClick={onClick}
    >
      {watched ? (
        <>
          <IoEyeOff className="w-4 h-4" />
          <span>Watched</span>
        </>
      ) : (
        <>
          <IoEye className="w-4 h-4" />
          <span>Unwatched</span>
        </>
      )}
    </button>
  );
};
