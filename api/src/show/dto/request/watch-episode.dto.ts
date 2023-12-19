import { IsBoolean, IsNotEmpty } from 'class-validator';

import { MarkOptions } from '@/show/types/mark-options';

export class WatchEpisodeDto {
  @IsNotEmpty()
  episodeId: string;

  @IsBoolean()
  isWatched: boolean;

  action: MarkOptions;
}
