import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AuthService } from '@/auth/auth.service';
import { UserDto } from '@/auth/dto';
import { UserConfigDto } from '@/common/dto';
import { UserConfig } from '@/common/entity';

@Injectable()
export class InitService {
  constructor(private authService: AuthService, private dataSource: DataSource) {}

  async findUserConfig(authUser: UserDto): Promise<UserConfig> {
    const user = await this.authService.findUserById(authUser.id);
    return user.config;
  }

  async saveUserConfig(authUser: UserDto, userConfig: UserConfigDto) {
    const user = await this.authService.findUserById(authUser.id);

    const config = user.config;
    config.notifierUrl = userConfig.notifierUrl;

    await this.dataSource.manager.save(config);
  }
}
