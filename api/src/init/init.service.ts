import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';

import { AuthService } from '@/auth/auth.service';
import { UserDto } from '@/auth/dto';
import { UserConfigDto } from '@/common/dto';
import { FollowedShow, Show, WatchedEpisode, UserConfig } from '@/common/entity';
import { ShowException } from '@/common/exceptions';

@Injectable()
export class InitService {
  constructor(
    private authService: AuthService,
    private dataSource: DataSource,
    @InjectRepository(FollowedShow) private followedShowRepository: Repository<FollowedShow>,
    @InjectRepository(Show) private showRepository: Repository<Show>,
    @InjectRepository(WatchedEpisode) private watchedRepository: Repository<WatchedEpisode>
  ) {}

  async findUserConfig(authUser: UserDto): Promise<UserConfig> {
    const user = await this.authService.findUserById(authUser.id);
    return user.config;
  }

  async saveUserConfigGeneral(authUser: UserDto, userConfig: UserConfigDto) {
    const user = await this.authService.findUserById(authUser.id);

    if (user) {
      const config = user.config;
      config.notifierUrl = userConfig.notifierUrl;

      await this.dataSource.manager.save(config);
    }
  }

  async saveUserConfigAccount(authUser: UserDto, userConfig: UserConfigDto) {
    const user = await this.authService.findUserById(authUser.id);
    const isPasswordValid = await bcrypt.compare(userConfig.passwordCurrent, user.password);

    if (!isPasswordValid) {
      throw new ShowException('Current password is incorrect');
    }

    if (userConfig.passwordNew1 !== userConfig.passwordNew2) {
      throw new ShowException('Passwords do not match');
    }

    const newPassword = await bcrypt.hash(userConfig.passwordNew1, 10);
    user.password = newPassword;
    await this.dataSource.manager.save(user);
  }

  async generateExportData(authUser: UserDto): Promise<any> {
    const user = await this.authService.findUserById(authUser.id);
    if (!user) throw new ShowException('User not found');

    const followedShows = await this.followedShowRepository.find({
      select: {
        show: {
          id: true,
          name: true,
          providerId: true,
        },
      },
      where: {
        user: {
          id: user.id,
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

    const allWatched = await this.watchedRepository.find({
      select: {
        episode: {
          providerId: true,
          name: true,
          number: true,
          season: {
            number: true,
            show: {
              id: true,
              name: true,
            },
          },
        },
      },
      where: {
        user: {
          id: user.id,
        },
      },
      relations: {
        episode: {
          season: {
            show: true,
          },
        },
      },
      order: {
        episode: {
          season: {
            number: 'ASC',
          },
          number: 'ASC',
        },
      },
    });

    const exportedShows = followedShows.map(followed => {
      const episodes = allWatched
        .filter(watched => {
          return watched.episode?.season?.show?.id === followed.show.id;
        })
        .map(ep => ({
          id: ep.id,
          providerId: ep.episode.providerId,
          name: ep.episode.name,
          seasonNumber: ep.episode.season?.number,
          episodeNumber: ep.episode.number,
        }));

      return {
        id: followed.show.id,
        providerId: followed.show.providerId,
        name: followed.show.name,
        episodes,
      };
    });

    return {
      shows: exportedShows,
    };
  }
}
