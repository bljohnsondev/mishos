import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Episode, FollowedShow, Season, Show, User, WatchedEpisode } from '@/common/entity';

import { UpNextController } from './upnext.controller';
import { UpNextService } from './upnext.service';

@Module({
  imports: [TypeOrmModule.forFeature([Episode, FollowedShow, Season, Show, User, WatchedEpisode])],
  controllers: [UpNextController],
  providers: [UpNextService],
})
export class UpNextModule {}
