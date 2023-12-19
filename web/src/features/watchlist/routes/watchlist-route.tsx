import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageTitle } from '@/components/layout';
import { useWatched, EpisodeList } from '@/features/shows';
import { EpisodeDto } from '@/types';

import { getWatchList } from '../api/api-watchlist';

export const WatchListRoute = () => {
  const navigate = useNavigate();
  const { markWatched } = useWatched();
  const [episodes, setEpisodes] = useState<EpisodeDto[] | undefined>();

  const loadWatchlist = async () => {
    getWatchList().then((episodes: EpisodeDto[]) => {
      setEpisodes(episodes);
    });
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const handleWatch = (episode: EpisodeDto, watched: boolean) => {
    markWatched(episode, watched).then(() => {
      loadWatchlist();
    });
  };

  const handleClickImage = (episode: EpisodeDto) => {
    if (episode.show) navigate(`/show/view/${episode.show.id}`);
  };

  return (
    <section>
      <PageTitle title="Watch List" />
      {episodes && (
        <EpisodeList
          episodes={episodes}
          display={{ image: true, showName: true }}
          emptyMessage="You are up to date!"
          onClickWatched={handleWatch}
          onClickImage={handleClickImage}
        />
      )}
    </section>
  );
};
