import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { UserDto } from '@/auth/dto';
import { EpisodeDto } from '@/common/dto';
import { Episode, FollowedShow, Season, Show, User, WatchedEpisode } from '@/common/entity';
import { EpisodeMapper } from '@/common/mapper';

@Injectable()
export class WatchListService {
  constructor(
    private episodeMapper: EpisodeMapper,
    private configService: ConfigService,
    @InjectRepository(Episode) private episodeRepository: Repository<Episode>,
    @InjectRepository(FollowedShow) private followedShowRepository: Repository<FollowedShow>,
    @InjectRepository(Season) private seasonRepository: Repository<Season>,
    @InjectRepository(Show) private showRepository: Repository<Show>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(WatchedEpisode) private watchedEpisodeRepository: Repository<WatchedEpisode>
  ) {}

  async findLastWatchedShows(userId: string, showIds: string[]): Promise<any> {
    return await this.showRepository
      .createQueryBuilder('show')
      .innerJoinAndSelect('show.seasons', 'season')
      .innerJoinAndSelect('season.episodes', 'episode')
      .leftJoinAndSelect('episode.watches', 'watch')
      .leftJoinAndSelect('watch.user', 'wuser')
      .where('show.id IN (:...showIds)', { showIds })
      .andWhere(
        new Brackets(qb => {
          qb.where('wuser.id = :wuserId', { wuserId: userId }).orWhere('wuser.id is null');
        })
      )
      .groupBy('show.id')
      .orderBy('MAX(watch.createdAt)', 'DESC')
      .select(['show.id', 'show.name', 'MAX(watch.createdAt) as last_watched'])
      .getRawMany();
  }

  async findWatchList(authUser: UserDto): Promise<EpisodeDto[]> {
    const showIds: string[] = (
      await this.followedShowRepository.find({
        select: {
          show: {
            id: true,
            name: true,
          },
        },
        where: {
          user: {
            id: authUser.id,
          },
        },
        relations: {
          show: true,
        },
      })
    ).map(fshow => fshow.show.id);

    if (showIds.length === 0) return [];

    // this is going to get all episodes that have aired for every followed show and then filter out the watched episodes
    const episodes: Episode[] = (
      await this.episodeRepository
        .createQueryBuilder('ep')
        .innerJoinAndSelect('ep.season', 'season')
        .innerJoinAndSelect('season.show', 'show')
        .leftJoinAndSelect('ep.watches', 'watches')
        .leftJoinAndSelect('watches.user', 'watchuser')
        .where('show.id IN (:...showIds)', { showIds })
        .andWhere('ep.aired < (:today)', { today: new Date() })
        .orderBy('show.name')
        .addOrderBy('season.number')
        .addOrderBy('ep.number')
        .select([
          'ep.id',
          'ep.name',
          'ep.number',
          'ep.aired',
          'ep.summary',
          'ep.runtime',
          'show.id',
          'show.name',
          'show.imageMedium',
          'show.imageOriginal',
          'show.network',
          'season.number',
          'watches.id',
          'watches.createdAt',
          'watchuser.id',
          'watchuser.username',
        ])
        .getMany()
    ).filter(ep => !ep.watches.some(watch => watch.user.id === authUser.id));

    const lastWatched = await this.findLastWatchedShows(authUser.id, showIds);
    const firstEpisodes: Episode[] = [];

    for (const lastShow of lastWatched) {
      const allUnwatched = episodes.filter((ep: Episode) => ep.season.show.id === lastShow.show_id);
      if (allUnwatched && allUnwatched.length > 0) {
        firstEpisodes.push(allUnwatched[0]);
      }
    }

    return firstEpisodes.map(ep => ({
      ...this.episodeMapper.toDto(ep),
      show: {
        ...ep.season.show,
      },
    }));
  }

  async findWatchListRecent(authUser: UserDto): Promise<EpisodeDto[]> {
    let limit = parseInt(this.configService.get('WATCHLIST_RECENT_LIMIT'));
    if (isNaN(limit)) limit = 10;

    const recentEpisodes: Episode[] = await this.episodeRepository.find({
      select: {
        id: true,
        name: true,
        number: true,
        summary: true,
        aired: true,
        runtime: true,
        season: {
          number: true,
        },
        watches: {
          createdAt: true,
        },
      },
      where: {
        watches: {
          user: {
            id: authUser.id,
          },
        },
      },
      order: {
        watches: {
          createdAt: 'DESC',
        },
      },
      relations: {
        season: {
          show: true,
        },
        watches: true,
      },
      take: limit,
    });

    return recentEpisodes.map(ep => ({
      ...this.episodeMapper.toDto(ep),
      watchedDate: ep.watches && ep.watches.length > 0 ? ep.watches[0].createdAt : undefined,
      show: {
        id: ep.season?.show?.id,
        name: ep.season?.show?.name,
        imageMedium: ep.season?.show?.imageMedium,
        network: ep.season?.show?.network,
      },
    }));
  }
}
