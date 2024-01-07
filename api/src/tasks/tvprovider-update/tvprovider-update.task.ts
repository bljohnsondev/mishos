import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { DataSource, Repository } from 'typeorm';

import { EpisodeDto, ShowDto } from '@/common/dto';
import { Episode, FollowedShow, Season, Show } from '@/common/entity';
import { TvProviderService } from '@/common/interfaces';
import { sleep } from '@/common/utils';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class TvProviderUpdateTaskService {
  private readonly logger = new Logger(TvProviderUpdateTaskService.name);

  constructor(
    private dataSource: DataSource,
    @Inject('TvProviderService') private tvProviderService: TvProviderService,
    @InjectRepository(Episode) private episodeRepository: Repository<Episode>,
    @InjectRepository(FollowedShow) private followedShowRepository: Repository<FollowedShow>,
    @InjectRepository(Season) private seasonRepository: Repository<Season>,
    @InjectRepository(Show) private showRepository: Repository<Show>
  ) {}

  private mapProviderEpisodeToObject(episode: EpisodeDto) {
    return {
      providerId: episode.id?.toString(),
      name: episode.name,
      number: episode.number,
      type: episode.type,
      aired: episode.aired,
      runtime: episode.runtime,
      summary: episode.summary,
    };
  }

  async updateShowData(show: Show, providerShow: ShowDto): Promise<void> {
    // first update the show data
    show.name = providerShow.name;
    show.providerUrl = providerShow.providerUrl;
    show.summary = providerShow.summary;
    show.language = providerShow.language;
    show.status = providerShow.status;
    show.runtime = providerShow.runtime;
    show.premiered = providerShow.premiered;
    show.ended = providerShow.ended;
    show.officialSite = providerShow.officialSite;
    show.network = providerShow.network;
    show.imageMedium = providerShow.imageMedium;
    show.imageOriginal = providerShow.imageOriginal;
    show.imdbId = providerShow.imdbId;

    // update the existing seasonss
    for (const season of show.seasons) {
      const providerSeason = providerShow.seasons.find(ps => ps.number === season.number);
      season.providerId = providerSeason.providerId;
      season.premiered = providerSeason.premiered;
      season.ended = providerSeason.ended;
      season.network = providerSeason.network;
      season.episodeOrder = providerSeason.episodeOrder;

      // update existing episodes for the season
      for (const episode of season.episodes) {
        const providerEpisode = providerSeason.episodes.find(pep => pep.number === episode.number);
        episode.providerId = providerEpisode.providerId;
        episode.name = providerEpisode.name;
        episode.type = providerEpisode.type;
        episode.aired = providerEpisode.aired;
        episode.runtime = providerEpisode.runtime;
        episode.summary = providerEpisode.summary;
      }

      // check for any new episodes in an existing season
      const missingEpisodes = providerSeason.episodes.filter(
        pep => !season.episodes.find(ep => ep.number === pep.number)
      );

      for (const missingEpisode of missingEpisodes) {
        const newEpisode = this.episodeRepository.create(this.mapProviderEpisodeToObject(missingEpisode));
        season.episodes.push(newEpisode);
      }
    }

    // look for new seasons
    const missingSeasons = providerShow.seasons.filter(
      ps => !show.seasons?.find(showSeason => showSeason.number === ps.number)
    );

    for (const missingSeason of missingSeasons) {
      const season = this.seasonRepository.create({
        providerId: missingSeason.id?.toString(),
        number: missingSeason.number,
        premiered: missingSeason.premiered,
        ended: missingSeason.ended,
        network: missingSeason.network,
        episodeOrder: missingSeason.episodeOrder,
      });

      const currentEpisodes = missingSeason.episodes.map(provEp => {
        return this.episodeRepository.create(this.mapProviderEpisodeToObject(provEp));
      });

      season.episodes = currentEpisodes;
      show.seasons.push(season);
    }

    await this.dataSource.manager.save(show);
  }

  async downloadFollowedShows() {
    const showIds: any | null = (
      await this.followedShowRepository
        .createQueryBuilder('fs')
        .innerJoinAndSelect('fs.show', 'show')
        .orderBy('show.name', 'ASC')
        .groupBy('show.id')
        .select(['show.id'])
        .getRawMany()
    ).map(row => row.show_id);

    for (const showId of showIds) {
      const show: Show | null = await this.showRepository.findOne({
        where: { id: showId },
        relations: {
          seasons: {
            episodes: true,
          },
        },
        order: {
          name: 'ASC',
          seasons: {
            number: 'ASC',
            episodes: {
              number: 'ASC',
            },
          },
        },
      });

      this.logger.debug(`updating data for followed show: ${show.name}`);

      const providerShow: ShowDto = await this.tvProviderService.getShow(show.providerId);
      await this.updateShowData(show, providerShow);
      this.logger.debug(`updated show data for ${show.id} - "${show.name}"`);

      // sleep for 10 seconds to provide a rate limit for the external API calls
      await sleep(10000);
    }
  }

  // run this job at midnight server time
  @Cron('0 0 0 * * *')
  async runTask() {
    this.logger.debug('refreshing show data');
    await this.downloadFollowedShows();
    this.logger.debug('refresh complete');
  }
}
