import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';

import { UserDto } from '@/auth/dto';
import { UpNextEpisodeDto } from '@/common/dto';
import { Episode } from '@/common/entity';
import { ShowService } from '@/show/show.service';

@Injectable()
export class UpNextService {
  constructor(
    @InjectRepository(Episode) private episodeRepository: Repository<Episode>,
    private showService: ShowService
  ) {}

  async findUpNextEpisodes(user: UserDto): Promise<UpNextEpisodeDto[]> {
    const followedShows = await this.showService.findFollowed(user.id);
    const followedIds = followedShows.map(show => show.id);

    const episodes: Episode[] = await this.episodeRepository.find({
      select: {
        id: true,
        name: true,
        number: true,
        aired: true,
        season: {
          id: true,
          number: true,
          show: {
            id: true,
            name: true,
            network: true,
            imageMedium: true,
          },
        },
      },
      where: {
        season: {
          show: {
            id: In(followedIds),
          },
        },
        aired: MoreThan(new Date()),
      },
      relations: {
        season: {
          show: true,
        },
      },
      order: {
        aired: 'ASC',
      },
    });

    const upnextEpisodes: UpNextEpisodeDto[] = episodes.map(episode => ({
      id: episode.id,
      name: episode.name,
      number: episode.number,
      seasonNumber: episode.season?.number,
      aired: episode.aired,
      show: {
        id: episode.season?.show?.id,
        name: episode.season.show?.name,
        network: episode.season?.show?.network,
        imageMedium: episode.season?.show?.imageMedium,
      },
    }));

    return upnextEpisodes;
  }
}
