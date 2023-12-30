import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';

import { ShowDto } from '@/common/dto';
import { Episode, Season, Show } from '@/common/entity';
import { TvProviderService } from '@/common/interfaces';
import { stripHtml } from '@/common/utils';

@Injectable()
export class TvMazeService implements TvProviderService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Show) private readonly showRepository: Repository<Show>,
    @InjectRepository(Season) private readonly seasonRepository: Repository<Season>,
    @InjectRepository(Episode) private readonly episodeRepository: Repository<Episode>
  ) {}

  public async search(query: string): Promise<ShowDto[]> {
    if (!query || query.length < 3) return [];

    const shows: ShowDto[] = [];

    const { data: response } = await this.httpService.axiosRef.get('/search/shows', {
      params: {
        q: query,
      },
    });

    if (response && Array.isArray(response)) {
      for (const data of response) {
        if (data.show) {
          const show: ShowDto = {
            providerId: data.show.id,
            name: data.show.name,
            imageMedium: data.show.image?.medium,
            summary: stripHtml(data.show.summary),
            network: data.show.network?.name ? data.show.network?.name : data.show.webChannel?.name,
            premiered: data.show.premiered,
          };

          shows.push(show);
        }
      }
    }

    return shows;
  }

  public async getShow(providerId: string): Promise<Show | undefined> {
    const { data: response } = await this.httpService.axiosRef.get(`/shows/${providerId}`);

    if (!response.name) return undefined;

    const show: Show = this.showRepository.create({
      providerId: response.id?.toString(),
      providerUrl: response.url,
      name: response.name,
      summary: stripHtml(response.summary),
      language: response.language,
      status: response.status,
      runtime: response.averageRuntime || response.runtime,
      premiered: response.premiered ? dayjs(response.premiered).toDate() : undefined,
      ended: response.ended ? dayjs(response.ended).toDate() : undefined,
      officialSite: response.officialSite,
      network: response.network?.name ? response.network?.name : response.webChannel?.name,
      imageMedium: response.image?.medium,
      imageOriginal: response.image?.original,
    });

    const seasons: Season[] | undefined = await this.getSeasonsAndEpisodes(providerId);

    show.seasons = seasons;

    return show;
  }

  public async getSeasonsAndEpisodes(providerId: string): Promise<Season[] | undefined> {
    const { data: seasonsResponse }: any = await this.httpService.axiosRef.get(`/shows/${providerId}/seasons`);
    if (!seasonsResponse) return [];

    const { data: episodesResponse }: any = await this.httpService.axiosRef.get(`/shows/${providerId}/episodes`);
    if (!episodesResponse) return [];

    const seasons: Season[] = [];

    seasonsResponse.forEach((provSeason: any) => {
      const season = this.seasonRepository.create({
        providerId: provSeason.id?.toString(),
        number: provSeason.number,
        premiered: provSeason.premiereDate ? dayjs(provSeason.premiereDate).toDate() : undefined,
        ended: provSeason.endDate ? dayjs(provSeason.endDate).toDate() : undefined,
        network: provSeason.network?.name,
        episodeOrder: provSeason.episodeOrder,
      });

      const currentEpisodes = episodesResponse
        .filter((provEp: any) => provEp.season === provSeason.number)
        .map((provEp: any) => {
          return this.episodeRepository.create({
            providerId: provEp.id?.toString(),
            name: provEp.name,
            number: provEp.number,
            type: provEp.type,
            aired: provEp.airstamp ? dayjs(provEp.airstamp).toDate() : undefined,
            runtime: provEp.runtime,
            summary: stripHtml(provEp.summary),
          });
        });

      season.episodes = currentEpisodes;

      seasons.push(season);
    });

    return seasons;
  }
}
