import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { DataSource, Equal, IsNull, Or, Repository } from 'typeorm';

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
      where: {
        user: {
          id: user.id,
        },
        show: {
          seasons: {
            episodes: {
              watches: {
                user: {
                  id: Or(Equal(user.id), IsNull()),
                },
              },
            },
          },
        },
      },
      relations: {
        show: {
          seasons: {
            episodes: {
              watches: true,
            },
          },
        },
      },
      order: {
        show: {
          name: 'ASC',
        },
      },
    });

    const exportedShows = followedShows.map(followed => {
      return followed.show;
    });

    const watchedEpisodes = await this.watchedRepository
      .createQueryBuilder('we')
      .select(['we.id as id', 'we.user.id as userId', 'we.episode.id as episodeId', 'we.createdAt as createdAt'])
      .where('we.user.id = :uid', { uid: user.id })
      .getRawMany();

    return {
      shows: exportedShows,
      watched: watchedEpisodes,
    };
  }
}
