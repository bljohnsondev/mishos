import { Body, Controller, Get, Post } from '@nestjs/common';

import { CurrentUser } from '@/common/decorators';
import { InitDataDto, UserDto } from '@/common/dto';

import { SaveUserConfigDto } from './dto/request/save-user-config.dto';
import { InitService } from './init.service';

@Controller('/api/init')
export class InitController {
  constructor(private initService: InitService) {}

  @Get('/view')
  async getInitData(@CurrentUser() user: UserDto): Promise<InitDataDto> {
    const userConfig = await this.initService.findUserConfig(user);
    return {
      userConfig,
    };
  }

  @Post('/saveconfig/general')
  async saveUserConfigGeneral(
    @CurrentUser() user: UserDto,
    @Body() saveUserConfigDto: SaveUserConfigDto
  ): Promise<any> {
    await this.initService.saveUserConfigGeneral(user, saveUserConfigDto.userConfig);
  }

  @Post('/saveconfig/account')
  async saveUserConfigAccount(
    @CurrentUser() user: UserDto,
    @Body() saveUserConfigDto: SaveUserConfigDto
  ): Promise<any> {
    await this.initService.saveUserConfigAccount(user, saveUserConfigDto.userConfig);
  }

  @Get('/exportdata')
  async exportData(@CurrentUser() user: UserDto) {
    return await this.initService.generateExportData(user);
  }
}
