import * as React from 'react';
import { IoBookmark, IoBookmarkOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import { PageTitle, Section, SectionTitle } from '@/components/layout';
import { showError } from '@/components/notifications';
import { useAppStore } from '@/stores';
import { EpisodeDto, ShowDto } from '@/types';
import { formatDate } from '@/utils';

import { useWatched, useShowFollows } from '../hooks';

import { EpisodeList } from './episode-list';
import { MarkPrevious } from './mark-previous';
import { SeasonPulldown } from './season-pulldown';

interface ShowDetailsProps {
  show: ShowDto;
  seasonNumber: number | undefined;
  onChangeSeason: (seasonNumber: number | undefined) => void;
  onRefresh: (showId: string) => void;
}

export const ShowDetails = ({ show, seasonNumber, onChangeSeason, onRefresh }: ShowDetailsProps) => {
  const { loading } = useAppStore();
  const { markWatched } = useWatched();
  const { followShow, unfollowShow } = useShowFollows();
  const navigate = useNavigate();
  const [markPrevious, setMarkPrevious] = React.useState(false);

  const handleSelectSeason = (newSeasonNumber: number | undefined) => {
    onChangeSeason(newSeasonNumber);
  };

  const handleClickWatched = async (episode: EpisodeDto, watched: boolean) => {
    markWatched(episode, watched, markPrevious).then(() => {
      setMarkPrevious(false);
      if (show.id) onRefresh(show.id);
    });
  };

  const handleChangeMarked = (value: boolean) => {
    setMarkPrevious(value);
  };

  const handleRemove = async () => {
    if (show.id) {
      await unfollowShow(show);
      navigate('/show/list');
    }
  };

  const handleAdd = async () => {
    if (!show.id) {
      const savedShow: ShowDto | undefined = await followShow(show);
      if (savedShow && savedShow.id) {
        navigate(`/show/view/${savedShow.id}`);
      } else {
        showError('Error adding show');
      }
    }
  };

  const season = seasonNumber && show.seasons ? show.seasons.find(sea => sea.number === seasonNumber) : undefined;

  return show ? (
    <>
      <PageTitle
        title={show.name ?? 'Unknown Title'}
        rightContent={<ShowOrAddButton show={show} onAdd={handleAdd} onRemove={handleRemove} />}
      />
      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="self-center md:self-start grow-0 shrink-0 basis-[240px] flex flex-col gap-2">
          <img
            src={show.imageMedium ?? '/images/empty-medium.jpg'}
            alt={show.name}
            className="object-contain rounded-lg"
          />
          {show.network && <DetailBox label="Network" value={show.network} />}
          {show.premiered && <DetailBox label="Premiered" value={formatDate(show.premiered)} />}
          {show.status && <DetailBox label="Status" value={show.status} />}
          <ProviderLink show={show} />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Section>
            <SectionTitle>Summary</SectionTitle>
            <div>{show.summary}</div>
          </Section>
          <div className="flex flex-col md:flex-row items-center">
            {show.seasons && show.seasons.length > 0 && (
              <div className="w-full md:w-56">
                <SeasonPulldown seasons={show.seasons} value={seasonNumber} onSelect={handleSelectSeason} />
              </div>
            )}
            {show.id && (
              <div className="md:ml-auto mt-3 md:mt-0">
                <MarkPrevious value={markPrevious} onChange={handleChangeMarked} />
              </div>
            )}
          </div>
          {season && season.episodes && <EpisodeList seasonNumber={season.number} episodes={season.episodes} onClickWatched={handleClickWatched} />}
        </div>
      </div>
    </>
  ) : loading ? (
    <Section>Please wait while TV show data is loaded</Section>
  ) : null;
};

interface DetailBoxProps {
  label: string;
  value: string | null;
}

const DetailBox = ({ label, value }: DetailBoxProps) => {
  return (
    <div className="bg-sky-300 border border-sky-500 dark:border-0 dark:bg-sky-800 px-3 py-2 rounded-lg shadow-lg">
      <span className="font-semibold">{label}:</span> {value}
    </div>
  );
};

interface ShowOrAddButtonProps {
  show: ShowDto;
  onAdd?: () => void;
  onRemove?: () => void;
}

const ShowOrAddButton = ({ show, onAdd, onRemove }: ShowOrAddButtonProps) => {
  return show.id ? (
    <button
      className="px-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 flex items-center gap-3 group"
      onClick={onRemove}
    >
      <IoBookmark className="h-5 w-5 text-amber-500 group-hover:text-amber-400" />
      <div className="text-sm font-semibold">Remove</div>
    </button>
  ) : (
    <button
      className="px-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 flex items-center gap-3 group"
      onClick={onAdd}
    >
      <IoBookmarkOutline className="h-5 w-5 text-amber-500 group-hover:text-amber-400" />
      <div className="text-sm font-semibold">Add</div>
    </button>
  );
};

interface ProviderLinkProps {
  show: ShowDto;
}

const ProviderLink = ({ show }: ProviderLinkProps) => {
  return (
    <a
      href={show.providerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-center w-full p-2 rounded-lg text-neutral-800 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-400 bg-neutral-400 dark:bg-neutral-800 hover:underline"
    >
      view at tvmaze.com
    </a>
  );
};
