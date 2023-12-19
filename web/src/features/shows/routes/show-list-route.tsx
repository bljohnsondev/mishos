import { useEffect, useState } from 'react';

import { PageTitle } from '@/components/layout';
import { ShowDto } from '@/types';

import { getFollowedShows } from '../api/api-shows';
import { ShowList } from '../components/show-list';

export const ShowListRoute = () => {
  const [shows, setShows] = useState<ShowDto[] | undefined>();

  const retrieveFollowedShows = async () => {
    // pull the followed shows and add the following flag
    const showsFromApi: ShowDto[] = await getFollowedShows();
    setShows(
      showsFromApi.map(show => ({
        ...show,
        following: true,
      }))
    );
  };

  useEffect(() => {
    retrieveFollowedShows();
  }, []);

  const handleRefresh = async () => {
    await retrieveFollowedShows();
  };

  return (
    <section>
      <PageTitle title="Shows" />
      {shows ? (
        <ShowList shows={shows} onRefresh={handleRefresh} />
      ) : (
        <div className="mt-16 w-full p-6 border border-neutral-800 text-neutral-600 rounded-lg">Loading shows...</div>
      )}
    </section>
  );
};
