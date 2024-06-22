import { kyWrapper } from '@/lib/ky-wrapper';
import type { SearchResultDto } from '@/types';

export const searchShowsFromProvider = async (query: string): Promise<SearchResultDto[]> => {
  const response: any = await kyWrapper
    .post('show/search', {
      json: { query },
    })
    .json();

  return response?.results as SearchResultDto[];
};
