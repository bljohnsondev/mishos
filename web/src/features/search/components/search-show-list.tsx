import * as React from 'react';
import { IoBookmarkOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import { Section } from '@/components/layout';
import { ShowCard, ShowCardInset, ShowCardOverlay, OverlayButton } from '@/features/shows';
import { useAppStore } from '@/stores';
import { ShowDto } from '@/types';

interface SearchShowsProps {
  shows: ShowDto[] | undefined;
  onAdd: (show: ShowDto) => void;
}

export const SearchShowList = ({ shows, onAdd }: SearchShowsProps) => {
  const navigate = useNavigate();
  const { loading } = useAppStore();

  const handleSelect = (show: ShowDto) => {
    if (show.providerId) {
      navigate(`/show/preview/${show.providerId}`);
    }
  };

  return shows && shows.length > 0 ? (
    <ul className="grid gap-3 grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {shows.map(show => (
        <li key={show.id || show.providerId}>
          <ShowCard key={show.id ?? show.providerId} show={show}>
            {!show.added ? (
              <>
                {!show.imageMedium && (
                  <div className="absolute inset-0 h-fit mb-auto text-sm text-center bg-black/50 w-full rounded-t-lg p-2">
                    {show.name}
                  </div>
                )}
                <ShowCardOverlay onSelect={() => handleSelect(show)}>
                  <OverlayButton onClick={() => onAdd(show)}>
                    <IoBookmarkOutline className="w-4 h-4" />
                    <span className="">Add</span>
                  </OverlayButton>
                </ShowCardOverlay>
              </>
            ) : (
              <ShowCardInset>
                <div className="bg-black rounded-t-lg p-2 bg-opacity-60 text-center text-neutral-200">Added</div>
              </ShowCardInset>
            )}
          </ShowCard>
        </li>
      ))}
    </ul>
  ) : loading ? (
    <Section>Searching for TV shows</Section>
  ) : (
    <Section>No results found for search terms</Section>
  );
};
