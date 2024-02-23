import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, LessThan, LessThanOrEqual, Repository } from 'typeorm';

import { AuthService } from '@/auth/auth.service';
import { UserDto } from '@/auth/dto';
import { EpisodeDto, ShowDto } from '@/common/dto';
import { Episode, FollowedShow, Season, Show, User, WatchedEpisode } from '@/common/entity';
import { ShowException } from '@/common/exceptions';
import { TvProviderService } from '@/common/interfaces';
import { EpisodeMapper, SeasonMapper, ShowMapper } from '@/common/mapper';
import { WatchEpisodeDto } from '@/show/dto';
import { NotifierTaskService } from '@/tasks/notifier/notifier.task';
import { TvProviderUpdateTaskService } from '@/tasks/tvprovider-update/tvprovider-update.task';

@Injectable()
export class ShowService {
  constructor(
    private showMapper: ShowMapper,
    private seasonMapper: SeasonMapper,
    private episodeMapper: EpisodeMapper,
    private authService: AuthService,
    private dataSource: DataSource,
    @Inject('TvProviderService') private tvProviderService: TvProviderService,
    @InjectRepository(Episode) private episodeRepository: Repository<Episode>,
    @InjectRepository(FollowedShow) private followedShowRepository: Repository<FollowedShow>,
    @InjectRepository(Season) private seasonRepository: Repository<Season>,
    @InjectRepository(Show) private showRepository: Repository<Show>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(WatchedEpisode) private watchedEpisodeRepository: Repository<WatchedEpisode>,
    @Inject(forwardRef(() => NotifierTaskService))
    private notifierTaskService: NotifierTaskService,
    private tvProviderUpdateTaskService: TvProviderUpdateTaskService
  ) {}

  async search(authUser: UserDto, query: string): Promise<ShowDto[]> {
    const shows: ShowDto[] = await this.tvProviderService.search(query);
    return await Promise.all(
      shows.map(async (show: Show) => {
        const followedShow: ShowDto = await this.findShowByProviderId(authUser, show.providerId);
        return {
          ...show,
          added: followedShow ? true : false,
          id: followedShow?.id,
        };
      })
    );
  }

  async getProviderShow(providerId: string): Promise<ShowDto | undefined> {
    try {
      const show: Show | undefined = await this.tvProviderService.getShow(providerId);

      if (show) {
        return this.showMapper.toDtoWithRelations(show);
      } else {
        return undefined;
      }
    } catch (err) {
      throw new ShowException(err.message);
    }
  }

  async findShowById(showId: string, includeEpisodes = false): Promise<Show | null> {
    return await this.showRepository.findOne({
      where: { id: showId },
      relations: includeEpisodes
        ? {
            seasons: {
              episodes: true,
            },
          }
        : {},
      order: {
        seasons: {
          number: 'ASC',
          episodes: {
            number: 'ASC',
          },
        },
      },
    });
  }

  async findShowWithWatched(authUser: UserDto, showId: string): Promise<ShowDto | null> {
    const user = await this.userRepository.findOne({
      where: { id: authUser.id },
      relations: {
        watchedEpisodes: {
          episode: true,
        },
      },
    });

    const show = await this.findShowById(showId, true);

    if (show) {
      const showDto: ShowDto | null = this.showMapper.toDto(show);
      // the mapper doesn't deal in calculated fields - this will insert watched status and season number
      showDto.seasons = show.seasons.map(season => ({
        ...this.seasonMapper.toDto(season),
        episodes: season.episodes.map(episode => ({
          ...this.episodeMapper.toDto(episode),
          seasonNumber: season.number,
          //watched: episode.watchedEpisodes?.some(watchedEp => watchedEp.user.id === user.id),
          watched: user.watchedEpisodes?.some(watchedEp => watchedEp.episode.id === episode.id),
        })),
      }));
      return showDto;
    } else {
      return null;
    }
  }

  async findFollowed(userId: string): Promise<Show[]> {
    const followedShows = await this.followedShowRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        show: true,
      },
      order: {
        show: {
          name: 'ASC',
        },
      },
    });

    return followedShows.map(followed => followed.show);
  }

  async findShowByProviderId(user: UserDto, providerId: string): Promise<Show | undefined> {
    const followed = await this.followedShowRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        show: {
          providerId,
        },
      },
      relations: {
        show: true,
      },
    });
    return followed ? followed.show : undefined;
  }

  async isFollowedByProviderId(user: UserDto, providerId: string): Promise<boolean> {
    const followedCount = await this.followedShowRepository.count({
      where: {
        user: {
          id: user.id,
        },
        show: {
          providerId,
        },
      },
    });
    return followedCount > 0;
  }

  async isFollowed(user: UserDto, showId: string): Promise<boolean> {
    const followedCount = await this.followedShowRepository.count({
      where: {
        user: {
          id: user.id,
        },
        show: {
          id: showId,
        },
      },
    });
    return followedCount > 0;
  }

  async addShowOrFollow(authUser: UserDto, providerId: string): Promise<Show | null> {
    const user = await this.authService.findUserById(authUser.id);
    if (!user) throw new UnauthorizedException();

    let show: Show | null | undefined = await this.showRepository.findOneBy({ providerId });

    if (!show) {
      // create the show if it didnt already exist
      show = await this.tvProviderService.getShow(providerId);
      if (!show) throw new ShowException(`Show not found: ${providerId}`);

      show = await this.dataSource.manager.save(show);
    }

    // follow the show if not already followed
    let followedShow = await this.followedShowRepository.findOneBy({
      user: {
        id: user.id,
      },
      show: {
        id: show.id,
      },
    });

    if (!followedShow) {
      followedShow = new FollowedShow();
      followedShow.user = user;
      followedShow.show = show;
      await this.dataSource.manager.save(followedShow);

      // when a show is followed recalculate the notifier schedule
      await this.notifierTaskService.createOrUpdateTask(followedShow);
    }

    return show;
  }

  async unfollowShow(authUser: UserDto, showId: string): Promise<void> {
    const show = await this.showRepository.findOneBy({
      id: showId,
    });

    if (show) {
      const followedShow = await this.followedShowRepository.findOneBy({
        user: {
          id: authUser.id,
        },
        show: {
          id: show.id,
        },
      });

      if (followedShow) {
        await this.followedShowRepository.remove(followedShow);
      }
    }
  }

  async findSeasons(showId: string): Promise<Season[]> {
    const seasons: Season[] = await this.seasonRepository.find({
      where: {
        show: {
          id: showId,
        },
      },
      order: {
        number: 'ASC',
      },
    });

    return seasons;
  }

  /**
   * There may be a way to do this at a DB level during the episode query but I sure couldn't
   * find a solution in the TypeORM documentation. This is done so the user doesn't see other
   * users who are watching an episode since it's none of their business.
   */
  filterEpisodesForWatched(user: UserDto, episodes: Episode[]): EpisodeDto[] {
    return episodes.map(episode => {
      const episodeDto = this.episodeMapper.toDto(episode);
      return {
        ...episodeDto,
        watched: episode.watches?.some(watchedEp => watchedEp.user.id === user.id),
      };
    });
  }

  async findEpisodesBySeasonId(seasonId: string): Promise<Episode[]> {
    const episodes: Episode[] = await this.episodeRepository.find({
      select: {
        watches: {
          id: true,
        },
      },
      where: {
        season: {
          id: seasonId,
        },
      },
      order: {
        number: 'ASC',
      },
      relations: {
        watches: true,
      },
    });

    return episodes;
  }

  async findEpisodeById(episodeId: string): Promise<Episode | null> {
    const episode: Episode | null = await this.episodeRepository.findOne({
      select: {
        season: {
          number: true,
          show: {
            id: true,
          },
        },
      },
      where: { id: episodeId },
      relations: {
        season: {
          show: true,
        },
      },
    });
    return episode;
  }

  async watchPreviousEpisodes(user: User, episode: Episode): Promise<void> {
    const currentSeasonNumber: number = episode.season.number;
    if (!episode.season?.show?.id) throw new ShowException('Could not determine show data');

    // this fun and complicated query finds all episodes prior to and including the one selected
    const unwatchedEpisodes: Episode[] = (
      await this.episodeRepository.find({
        select: {
          season: {
            number: true,
            show: {
              id: true,
            },
          },
        },
        where: [
          {
            season: {
              show: {
                id: episode.season.show.id,
              },
              number: LessThan(currentSeasonNumber),
            },
          },
          {
            season: {
              show: {
                id: episode.season.show.id,
              },
              number: Equal(currentSeasonNumber),
            },
            number: LessThanOrEqual(episode.number),
          },
        ],
        order: {
          season: {
            number: 'ASC',
          },
          number: 'ASC',
        },
        relations: {
          season: {
            show: true,
          },
        },
      })
    ).filter(ep => {
      // filter out any episodes that have already been watched
      if (user.watchedEpisodes?.find(watchedEp => watchedEp.episode.id === ep.id)) return false;
      else return true;
    });

    if (unwatchedEpisodes.length > 0) {
      const newWatched: WatchedEpisode[] = [];

      for (const unwatched of unwatchedEpisodes) {
        newWatched.push(this.watchedEpisodeRepository.create({ user, episode: unwatched }));
      }

      await this.watchedEpisodeRepository.insert(newWatched);
    }
  }

  async watchEpisode(authUser: UserDto, watchEpisodeDto: WatchEpisodeDto): Promise<void> {
    const { episodeId, isWatched, action } = watchEpisodeDto;

    const user = await this.userRepository.findOne({
      select: {
        watchedEpisodes: true,
      },
      where: {
        id: authUser.id,
      },
      relations: {
        watchedEpisodes: {
          episode: true,
        },
      },
    });
    if (!user) throw new UnauthorizedException();

    const episode = await this.findEpisodeById(episodeId);
    if (!episode) throw new ShowException(`Episode not found: ${episodeId}`);

    if (isWatched) {
      if (action === 'single') {
        if (user.watchedEpisodes?.find(wep => wep.episode.id === episodeId)) {
          throw new ShowException('Show already watched');
        }

        await this.watchedEpisodeRepository.insert({
          user,
          episode,
        });
      } else {
        await this.watchPreviousEpisodes(user, episode);
      }
    } else {
      await this.watchedEpisodeRepository.delete({
        user,
        episode,
      });
    }
  }

  async updateShowFromProvider(showId: string): Promise<void> {
    const show = await this.findShowById(showId, true);
    if (show) {
      const providerShow: ShowDto = await this.tvProviderService.getShow(show.providerId);
      await this.tvProviderUpdateTaskService.updateShowData(show, providerShow);
    }
  }
}
