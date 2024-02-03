import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Episode, FollowedShow, Season, Show, User, WatchedEpisode } from '@/common/entity';
import { ShowModule } from '@/show/show.module';

import { UpcomingController } from './upcoming.controller';
import { UpcomingService } from './upcoming.service';

@Module({
  imports: [TypeOrmModule.forFeature([Episode, FollowedShow, Season, Show, User, WatchedEpisode]), ShowModule],
  controllers: [UpcomingController],
  providers: [UpcomingService],
})
export class UpcomingModule {}
