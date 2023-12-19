import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Episode, FollowedShow, Season, Show, User, WatchedEpisode } from '@/common/entity';
import { ShowModule } from '@/show/show.module';
import { TvMazeService } from '@/show/tvproviders/tvmaze.service';

import { NotifierTaskService } from './notifier/notifier.task';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TvProviderUpdateTaskService } from './tvprovider-update/tvprovider-update.task';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('API_URL'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Episode, FollowedShow, Season, Show, User, WatchedEpisode]),
    forwardRef(() => ShowModule),
  ],
  providers: [
    NotifierTaskService,
    TasksService,
    TvProviderUpdateTaskService,
    { provide: 'TvProviderService', useClass: TvMazeService },
  ],
  controllers: [TasksController],
  exports: [NotifierTaskService],
})
export class TasksModule {}
