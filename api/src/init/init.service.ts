import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { AuthService } from '@/auth/auth.service';
import { UserDto } from '@/auth/dto';
import { UserConfigDto } from '@/common/dto';
import { UserConfig } from '@/common/entity';
import { ShowException } from '@/common/exceptions';

@Injectable()
export class InitService {
  constructor(private authService: AuthService, private dataSource: DataSource) {}

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
      throw new ShowException('Current password is not correct');
    }

    if (userConfig.passwordNew1 !== userConfig.passwordNew2) {
      throw new ShowException('Passwords do not match');
    }

    const newPassword = await bcrypt.hash(userConfig.passwordNew1, 10);
    user.password = newPassword;
    await this.dataSource.manager.save(user);
  }
}
