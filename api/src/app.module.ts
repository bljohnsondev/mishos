import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './common/config/db-config';
import { InitModule } from './init/init.module';
import { ShowModule } from './show/show.module';
import { TasksModule } from './tasks/tasks.module';
import { UpcomingModule } from './upcoming/upcoming.module';
import { WatchListModule } from './watchlist/watchlist.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    InitModule,
    ShowModule,
    TasksModule,
    UpcomingModule,
    WatchListModule,
  ],
})
export class AppModule {}
