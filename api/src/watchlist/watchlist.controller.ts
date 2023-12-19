import { Controller, Get, Request } from '@nestjs/common';

import { UserDto } from '@/auth/dto';

import { WatchListService } from './watchlist.service';

@Controller('/api/watchlist')
export class WatchListController {
  constructor(private watchListService: WatchListService) {}

  @Get()
  async currentWatchList(@Request() req): Promise<any> {
    const authUser: UserDto = req.user;
    return this.watchListService.findWatchList(authUser);
  }
}
