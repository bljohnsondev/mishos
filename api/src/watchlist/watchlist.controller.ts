import { Controller, Get } from '@nestjs/common';

import { UserDto } from '@/auth/dto';
import { CurrentUser } from '@/common/decorators';
import { EpisodeDto } from '@/common/dto';

import { WatchListService } from './watchlist.service';

@Controller('/api/watchlist')
export class WatchListController {
  constructor(private watchListService: WatchListService) {}

  @Get()
  async currentWatchList(@CurrentUser() user: UserDto): Promise<EpisodeDto[]> {
    return await this.watchListService.findWatchList(user);
  }

  @Get('/recent')
  async recentWatchList(@CurrentUser() user: UserDto): Promise<EpisodeDto[]> {
    return await this.watchListService.findWatchListRecent(user);
  }
}
