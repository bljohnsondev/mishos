import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Episode, FollowedShow, Season, Show, User, UserConfig, WatchedEpisode } from '@/common/entity';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const runningEnv = process.env.NODE_ENV;
  const dbType = configService.get('DB_TYPE');
  const entities = [Episode, FollowedShow, Season, Show, User, UserConfig, WatchedEpisode];

  const initConfig = {
    entities,
    synchronize: runningEnv !== 'production',
    timezone: 'Z',
  };

  switch (dbType) {
    case 'sqlite':
      return {
        type: 'sqlite',
        database: configService.get('DB_PATH'),
        ...initConfig,
      };
    case 'mysql':
      return {
        type: 'mysql',
        url: configService.get('DB_URL'),
        ...initConfig,
      };
  }
};
