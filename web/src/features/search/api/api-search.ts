import { axios } from '@/lib/axios';
import { ShowDto } from '@/types';

export const searchShowsFromProvider = async (query: string): Promise<ShowDto[]> => {
  return await axios.post('/show/search', {
    query,
  });
};
