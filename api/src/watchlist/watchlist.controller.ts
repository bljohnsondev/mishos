import { Controller, Get } from '@nestjs/common';

import { UserDto } from '@/auth/dto';
import { CurrentUser } from '@/common/decorators';

import { WatchListService } from './watchlist.service';

@Controller('/api/watchlist')
export class WatchListController {
  constructor(private watchListService: WatchListService) {}

  @Get()
  async currentWatchList(@CurrentUser() user: UserDto): Promise<any> {
    return this.watchListService.findWatchList(user);
  }
}
