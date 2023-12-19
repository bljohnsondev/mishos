import { Injectable } from '@nestjs/common';

import { SeasonDto } from '@/common/dto';
import { Season } from '@/common/entity';
import { Mapper } from '@/common/interfaces';

import { EpisodeMapper } from './episode.mapper';

@Injectable()
export class SeasonMapper implements Mapper<Season, SeasonDto> {
  constructor(private readonly episodeMapper: EpisodeMapper) {}

  public toDto(season: Season): SeasonDto {
    return {
      id: season.id,
      number: season.number,
      premiered: season.premiered,
      ended: season.ended,
      network: season.network,
      episodeOrder: season.episodeOrder,
      createdAt: season.createdAt,
    };
  }

  public toDtoWithRelations(season: Season): SeasonDto {
    const seasonDto = this.toDto(season);
    return {
      ...seasonDto,
      episodes: season.episodes.map(ep => this.episodeMapper.toDto(ep)),
    };
  }
}
