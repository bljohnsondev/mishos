import { ShowDto } from '@/common/dto';
import { Season, Show } from '@/common/entity';

export interface TvProviderService {
  search: (query: string) => Promise<ShowDto[]>;
  getShow: (providerId: string) => Promise<Show | undefined>;
  getSeasonsAndEpisodes: (providerId: string) => Promise<Season[] | undefined>;
}
