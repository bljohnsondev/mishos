import * as React from 'react';
import { useParams } from 'react-router-dom';

import { PageTitle } from '@/components/layout';
import { useShowFollows } from '@/features/shows';
import { ShowDto } from '@/types';

import { searchShowsFromProvider } from '../api/api-search';
import { SearchShowList } from '../components/search-show-list';

export const SearchRoute = () => {
  const { query } = useParams();
  const { followShow } = useShowFollows();
  const [results, setResults] = React.useState<ShowDto[] | undefined>();

  React.useEffect(() => {
    if (query) {
      searchShowsFromProvider(query).then((shows: ShowDto[]) => {
        setResults(shows);
      });
    }
  }, [query]);

  const handleAdd = async (show: ShowDto) => {
    if (show && show.providerId) {
      await followShow(show);
      setResults(
        results?.map(result => {
          return {
            ...result,
            added: result.providerId === show.providerId ? true : result.added,
          };
        })
      );
    }
  };

  return (
    <section>
      <PageTitle title="Search Results" />
      <SearchShowList shows={results} onAdd={handleAdd} />
    </section>
  );
};
