import { Inject, Injectable } from '@nestjs/common';

import { ShowDto } from '@/common/dto';
import { Show } from '@/common/entity';
import { Mapper } from '@/common/interfaces';

import { SeasonMapper } from './season.mapper';

@Injectable()
export class ShowMapper implements Mapper<Show, ShowDto> {
  @Inject(SeasonMapper) private readonly seasonMapper: SeasonMapper;

  public toDto(show: Show): ShowDto {
    return {
      id: show.id,
      providerId: show.providerId,
      name: show.name,
      providerUrl: show.providerUrl,
      summary: show.summary,
      language: show.language,
      status: show.status,
      runtime: show.runtime,
      premiered: show.premiered,
      ended: show.ended,
      officialSite: show.officialSite,
      network: show.network,
      imageMedium: show.imageMedium,
      imageOriginal: show.imageOriginal,
      imdbId: show.imdbId,
      createdAt: show.createdAt,
    };
  }

  public toDtoWithRelations(show: Show): ShowDto {
    const showDto = this.toDto(show);
    return {
      ...showDto,
      seasons: show.seasons?.map(season => this.seasonMapper.toDtoWithRelations(season)),
    };
  }
}
