import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from '@/auth/auth.service';
import { User, UserConfig } from '@/common/entity';
import { ShowModule } from '@/show/show.module';

import { InitController } from './init.controller';
import { InitService } from './init.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserConfig]), ShowModule],
  controllers: [InitController],
  providers: [AuthService, InitService, JwtService],
})
export class InitModule {}
