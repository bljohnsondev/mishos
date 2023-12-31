import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from '@/auth/auth.service';
import { Episode, FollowedShow, Season, Show, User, WatchedEpisode } from '@/common/entity';
import { EpisodeMapper, SeasonMapper, ShowMapper, UserMapper } from '@/common/mapper';
import { TasksModule } from '@/tasks/tasks.module';

import { ShowController } from './show.controller';
import { ShowService } from './show.service';
import { TvMazeService } from './tvproviders/tvmaze.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('API_URL'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Episode, FollowedShow, Season, Show, User, WatchedEpisode]),
    forwardRef(() => TasksModule),
  ],
  providers: [
    AuthService,
    JwtService,
    ShowService,
    { provide: 'TvProviderService', useClass: TvMazeService },
    EpisodeMapper,
    SeasonMapper,
    ShowMapper,
    UserMapper,
  ],
  controllers: [ShowController],
  exports: [EpisodeMapper, ShowMapper, ShowService, UserMapper],
})
export class ShowModule {}
