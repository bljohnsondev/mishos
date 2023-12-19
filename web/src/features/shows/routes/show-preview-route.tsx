import * as React from 'react';
import { useParams } from 'react-router-dom';

import { Section } from '@/components/layout';
import { useAppStore } from '@/stores';
import { ShowDto } from '@/types';

import { getProviderPreview } from '../api/api-shows';
import { ShowDetails } from '../components/show-details';

export const ShowPreviewRoute = () => {
  const { id } = useParams();
  const { loading } = useAppStore();
  const [show, setShow] = React.useState<ShowDto | undefined>();
  const [seasonNumber, setSeasonNumber] = React.useState<number | undefined>();

  const handleRefresh = React.useCallback(
    (providerId: string) => {
      if (id) {
        getProviderPreview(providerId).then(loadedShow => {
          if (loadedShow) {
            setShow(loadedShow);
            if (!seasonNumber && loadedShow.seasons && loadedShow.seasons.length > 0) {
              setSeasonNumber(1);
            }
          }
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );

  React.useEffect(() => {
    if (id) {
      handleRefresh(id);
    }
  }, [id, handleRefresh]);

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
  ) : loading ? (
    <Section>Please wait while TV show data is loaded</Section>
  ) : null;
};
