import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { config } from '@/config';
import { ShowDto } from '@/types';

import { searchShowsFromProvider } from '../api/api-search';

export const useProviderSearch = () => {
  const navigate = useNavigate();

  const searchShows = async (query: string): Promise<ShowDto[] | undefined> => {
    try {
      const shows = await searchShowsFromProvider(query);
      return shows;
    } catch (ex) {
      if (ex instanceof AxiosError) {
        if (ex.response?.status === 401) {
          navigate(config.loginUrl);
        }
      }
    }
  };

  return { searchShows };
};
