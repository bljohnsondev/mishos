import { Controller, Get } from '@nestjs/common';

import { CurrentUser } from '@/common/decorators';
import { UpNextEpisodeDto, UserDto } from '@/common/dto';

import { UpNextService } from './upnext.service';

@Controller('/api/upnext')
export class UpNextController {
  constructor(private upnextService: UpNextService) {}

  @Get('/')
  async upnextList(@CurrentUser() user: UserDto): Promise<UpNextEpisodeDto[]> {
    return await this.upnextService.findUpNextEpisodes(user);
  }
}
