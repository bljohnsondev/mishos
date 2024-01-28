import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from '@/auth/auth.service';
import { FollowedShow, Show, User, UserConfig, WatchedEpisode } from '@/common/entity';
import { ShowModule } from '@/show/show.module';

import { InitController } from './init.controller';
import { InitService } from './init.service';

@Module({
  imports: [TypeOrmModule.forFeature([FollowedShow, Show, User, UserConfig, WatchedEpisode]), ShowModule],
  controllers: [InitController],
  providers: [AuthService, InitService, JwtService],
})
export class InitModule {}
