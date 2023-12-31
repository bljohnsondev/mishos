import { Controller, Get } from '@nestjs/common';

import { CurrentUser } from '@/common/decorators';
import { UserDto } from '@/common/dto';

import { UpNextService } from './upnext.service';

@Controller('/api/upnext')
export class UpNextController {
  constructor(private upnextService: UpNextService) {}

  @Get('/')
  async upnextList(@CurrentUser() user: UserDto): Promise<any> {
    const something = await this.upnextService.findUpNextEpisodes(user);
    return something;
  }
}
