import { IoBookmark } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import { Section } from '@/components/layout';
import { ShowDto } from '@/types';

import { useShowFollows } from '../hooks/show-follows';

import { ShowCard, ShowCardOverlay, OverlayButton } from './show-card';

interface ShowListProps {
  shows: ShowDto[];
  onRefresh: () => void;
}

export const ShowList = ({ shows, onRefresh }: ShowListProps) => {
  const navigate = useNavigate();
  const { unfollowShow } = useShowFollows();

  const handleSelect = (show: ShowDto) => {
    navigate({
      pathname: `/show/view/${show.id}`,
    });
  };

  const handleRemove = async (show: ShowDto) => {
    await unfollowShow(show);
    onRefresh();
  };

  return shows && shows.length > 0 ? (
    <ul className="grid gap-3 grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {shows.map(show => (
        <li key={show.id || show.providerId}>
          <ShowCard key={show.id ?? show.providerId} show={show}>
            <ShowCardOverlay onSelect={() => handleSelect(show)}>
              <OverlayButton onClick={handleRemove}>
                <IoBookmark className="w-4 h-4 text-neutral-700" />
                <span className="">Remove</span>
              </OverlayButton>
            </ShowCardOverlay>
          </ShowCard>
        </li>
      ))}
    </ul>
  ) : (
    <Section>You have not added any shows to your list yet.</Section>
  );
};
