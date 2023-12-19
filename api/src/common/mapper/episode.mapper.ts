import { Injectable } from '@nestjs/common';

import { EpisodeDto } from '@/common/dto';
import { Episode } from '@/common/entity';
import { Mapper } from '@/common/interfaces';

@Injectable()
export class EpisodeMapper implements Mapper<Episode, EpisodeDto> {
  public toDto(episode: Episode): EpisodeDto {
    return {
      id: episode.id,
      name: episode.name,
      number: episode.number,
      type: episode.type,
      aired: episode.aired,
      runtime: episode.runtime,
      summary: episode.summary,
      createdAt: episode.createdAt,
      seasonNumber: episode.season?.number,
    };
  }
}
