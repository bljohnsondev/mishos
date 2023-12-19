import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { Repository } from 'typeorm';

import { Episode, FollowedShow, Show, User } from '@/common/entity';

import { CommonTaskService } from '../common.task';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface NotifierTask {
  taskName: string;
  followedShow: FollowedShow;
  episode: Episode;
  nextRun: Date;
}

@Injectable()
export class NotifierTaskService extends CommonTaskService {
  private readonly logger = new Logger(NotifierTaskService.name);
  private notifierTasks: NotifierTask[] = [];

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(Episode) private episodeRepository: Repository<Episode>,
    @InjectRepository(FollowedShow) private followedShowRepository: Repository<FollowedShow>,
    @InjectRepository(Show) private showRepository: Repository<Show>
  ) {
    super();
  }

  private calculateUpcomingTimestamp(stamp: Date) {
    const timezone = this.configService.get<string>('NOTIFICATION_TZ');

    if (timezone) {
      return dayjs(stamp).utc().tz(timezone).subtract(1, 'hour');
    } else {
      // by default it will use the server timezone
      return dayjs(stamp).subtract(1, 'hour');
    }
  }

  getTasks() {
    return this.notifierTasks;
  }

  async findUpcomingEpisode(showId: string, skipEpisodeId?: string): Promise<Episode | null> {
    const queryBuilder = this.episodeRepository
      .createQueryBuilder('ep')
      .innerJoinAndSelect('ep.season', 'season')
      .innerJoin('season.show', 'show')
      .where('show.id = :showId', { showId })
      .andWhere('ep.aired > :today', { today: new Date() })
      .orderBy('ep.aired', 'ASC')
      .limit(1);

    // this is to ignore the current episode for scheduling the next one
    if (skipEpisodeId) {
      queryBuilder.andWhere('ep.id <> :ignoreId', { ignoreId: skipEpisodeId });
    }

    return await queryBuilder.getOne();
  }

  async sendNotification(user: User, title: string, body: string) {
    const url = user.config?.notifierUrl;

    if (!url) {
      this.logger.warn(`could not find a valid notification url for user [${user.username}]`);
      return;
    }

    try {
      let payload: any = { title, body };
      const payloadString = this.configService.get<string>('NOTIFICATION_PAYLOAD');

      if (payloadString) {
        const escapedPayload = payloadString
          .replace('{{title}}', title.replace('"', '\\"'))
          .replace('{{body}}', body.replace('"', '\\"'));

        try {
          payload = JSON.parse(escapedPayload);
        } catch (err) {
          this.logger.error(
            `error parsing payload when sending notification: check payload string in env file: ${escapedPayload}`
          );
        }
      }

      const { data: response } = await this.httpService.axiosRef.post(url, payload);
      this.logger.debug('sending notification received response: ' + JSON.stringify(response, null, 2));
    } catch (err) {
      this.logger.error('error sending notification', err);
    }
  }

  saveTask(task: NotifierTask) {
    if (dayjs(task.nextRun).isBefore(dayjs())) {
      this.logger.debug(
        `skipping notification task due to past run date "${task.taskName}": ${task.followedShow.show.name} - ${dayjs(
          task.nextRun
        ).format('MM/DD/YYYY HH:mm')}`
      );
      return;
    }

    if (!this.notifierTasks.find(nt => nt.taskName === task.taskName)) {
      this.logger.debug(
        `adding new notification task "${task.taskName}": ${task.followedShow.show.name} [${task.followedShow.user.username}]`
      );
      this.notifierTasks.push(task);
    } else {
      this.logger.debug(
        `updating existing notification task "${task.taskName}": ${task.followedShow.show.name} [${task.followedShow.user.username}]`
      );
      // replace the current task with the new one since the episode may have changed
      this.notifierTasks = this.notifierTasks.filter(nt => nt.taskName !== task.taskName);
      this.notifierTasks.push(task);
    }

    // if saving an existing job the schedule function will change it
    this.schedule(`${task.taskName}`, task.nextRun);
  }

  removeTask(taskName: string) {
    const task: NotifierTask | undefined = this.notifierTasks.find(nt => nt.taskName === taskName);

    if (task) {
      this.notifierTasks = this.notifierTasks.filter(nt => nt.taskName !== taskName);
      this.stopTask(task.taskName);
    }
  }

  async runTask(taskName: string) {
    this.logger.debug(`running notifier task "${taskName}"`);

    const task = this.notifierTasks.find(nt => nt.taskName === taskName);

    if (!task) {
      this.logger.warn(`task run error: invalid task: could not find task by taskName: ${taskName}`);
      this.stopTask(taskName);
      return;
    }

    const { episode, followedShow } = task;

    this.logger.debug(
      `sending notification for show: ${followedShow.show.name} - ${episode.name} - starting at ${dayjs(
        episode.aired
      ).format('h:mm A')}`
    );

    await this.sendNotification(
      followedShow.user,
      followedShow.show.name,
      `Episode S${episode.season.number}E${episode.number} starting in an hour: ${episode.name}`
    );

    // after sending the notification calculate if/when the next one should occur
    const nextEpisode = await this.findUpcomingEpisode(followedShow.show.id, episode.id);
    if (nextEpisode) {
      const upcomingStamp = this.calculateUpcomingTimestamp(nextEpisode.aired);
      this.saveTask({
        ...task,
        episode: nextEpisode,
        nextRun: upcomingStamp.toDate(),
      });
    } else {
      this.logger.debug(`task run warning: could not find the next episode of "${followedShow.show.name}"`);
      this.removeTask(taskName);
    }
  }

  async createOrUpdateTask(followedShow: FollowedShow) {
    const { show, user } = followedShow;

    // only create notifier tasks if the user has the notifier URL set
    if (!user.config || !user.config.notifierUrl) {
      this.logger.debug(`skipping notifier for "${show.name}" [${user.username}]: user has no notifier url set`);
      return;
    }

    const upcomingEpisode: Episode | null = await this.findUpcomingEpisode(followedShow.show.id);

    if (upcomingEpisode && upcomingEpisode.aired) {
      let task: NotifierTask | undefined = this.notifierTasks.find(nt => nt.followedShow.id === followedShow.id);
      const upcomingStamp = this.calculateUpcomingTimestamp(upcomingEpisode.aired);

      if (!task) {
        task = {
          taskName: `notification:${show.id}:${user.id}`,
          followedShow,
          episode: upcomingEpisode,
          nextRun: upcomingStamp.toDate(),
        };

        this.saveTask(task);
      } else {
        // task already exists so update it
        this.saveTask({
          ...task,
          episode: upcomingEpisode,
          nextRun: upcomingStamp.toDate(),
        });
      }
    } else {
      this.logger.debug(`skipping scheduled task for "${show.name}": no upcoming episodes with air date`);
    }
  }

  async initializeTasks() {
    this.logger.debug('initializing schedule task: notifier');

    const followedShows: FollowedShow[] = await this.followedShowRepository
      .createQueryBuilder('fs')
      .innerJoinAndSelect('fs.show', 'show')
      .innerJoinAndSelect('fs.user', 'user')
      .leftJoinAndSelect('user.config', 'config')
      .orderBy('show.name', 'ASC')
      .getMany();

    for (const followedShow of followedShows) {
      await this.createOrUpdateTask(followedShow);
    }
  }

  // this job is scheduled to run daily to stop all existing tasks and initialize them again
  // this will take care of episode updates (new episodes, time changes, etc)
  @Cron('0 0 2 * * *')
  initializeOnSchedule() {
    this.initializeTasks();
  }

  // set up the schedule if the server is restarted
  onApplicationBootstrap() {
    this.initializeTasks();
  }
}
