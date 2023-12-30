import { kyWrapper } from '@/lib/ky-wrapper';
import { ShowDto } from '@/types';

export const searchShowsFromProvider = async (query: string): Promise<ShowDto[]> => {
  const response = await kyWrapper
    .post('show/search', {
      json: { query },
    })
    .json();

  return response as ShowDto[];
};
