import * as React from 'react';
import { useParams } from 'react-router-dom';

import { ShowDto } from '@/types';

import { getShowDetails } from '../api/api-shows';
import { ShowDetails } from '../components/show-details';

export const ShowDetailsRoute = () => {
  const { id } = useParams();
  const [show, setShow] = React.useState<ShowDto | undefined>();
  const [seasonNumber, setSeasonNumber] = React.useState<number | undefined>();

  const handleRefresh = React.useCallback(
    (showId: string) => {
      if (id) {
        getShowDetails(showId).then(loadedShow => {
          if (loadedShow) {
            setShow(loadedShow);
            if (!seasonNumber && loadedShow.seasons && loadedShow.seasons.length > 0) {
              setSeasonNumber(1);
            }
          }
        });
      }
    },
    [id, seasonNumber]
  );

  React.useEffect(() => {
    if (id) {
      handleRefresh(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChangeSeason = (newSeasonNumber: number | undefined) => {
    setSeasonNumber(newSeasonNumber);
  };

  return show ? (
    <section>
      <ShowDetails
        show={show}
        seasonNumber={seasonNumber}
        onChangeSeason={handleChangeSeason}
        onRefresh={handleRefresh}
      />
    </section>
  ) : null;
};
