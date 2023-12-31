import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Episode, FollowedShow, Season, Show, User, WatchedEpisode } from '@/common/entity';
import { ShowModule } from '@/show/show.module';

import { UpNextController } from './upnext.controller';
import { UpNextService } from './upnext.service';

@Module({
  imports: [TypeOrmModule.forFeature([Episode, FollowedShow, Season, Show, User, WatchedEpisode]), ShowModule],
  controllers: [UpNextController],
  providers: [UpNextService],
})
export class UpNextModule {}
