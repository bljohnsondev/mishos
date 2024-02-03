import { Controller, Get } from '@nestjs/common';

import { CurrentUser } from '@/common/decorators';
import { UpcomingEpisodeDto, UserDto } from '@/common/dto';

import { UpcomingService } from './upcoming.service';

@Controller('/api/upcoming')
export class UpcomingController {
  constructor(private upcomingService: UpcomingService) {}

  @Get('/')
  async upcomingList(@CurrentUser() user: UserDto): Promise<UpcomingEpisodeDto[]> {
    return await this.upcomingService.findUpcomingEpisodes(user);
  }
}
