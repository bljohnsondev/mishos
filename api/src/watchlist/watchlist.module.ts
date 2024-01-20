import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Episode, FollowedShow, Season, Show, User, WatchedEpisode } from '@/common/entity';
import { ShowModule } from '@/show/show.module';

import { WatchListController } from './watchlist.controller';
import { WatchListService } from './watchlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([Episode, FollowedShow, Season, Show, User, WatchedEpisode]), ShowModule],
  controllers: [WatchListController],
  providers: [ConfigService, WatchListService],
})
export class WatchListModule {}
