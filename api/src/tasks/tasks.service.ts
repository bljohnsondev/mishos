import { Injectable, Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';

import { EpisodeMapper, ShowMapper, UserMapper } from '@/common/mapper';

import { TaskDto } from './dto/task.dto';
import { NotifierTask, NotifierTaskService } from './notifier/notifier.task';
import { TvProviderUpdateTaskService } from './tvprovider-update/tvprovider-update.task';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private episodeMapper: EpisodeMapper,
    private showMapper: ShowMapper,
    private userMapper: UserMapper,
    private notifierTaskService: NotifierTaskService,
    private tvUpdateTaskService: TvProviderUpdateTaskService
  ) {}

  async findTasks(): Promise<TaskDto[]> {
    const notifierTasks: NotifierTask[] = this.notifierTaskService.getTasks();

    const tasks: TaskDto[] = notifierTasks.map(notifierTask => {
      return {
        type: 'notification',
        taskName: notifierTask.taskName,
        next: notifierTask.nextRun,
        user: this.userMapper.toDto(notifierTask.followedShow.user),
        show: this.showMapper.toDto(notifierTask.followedShow.show),
        episode: this.episodeMapper.toDto(notifierTask.episode),
      };
    });

    return tasks.sort((a, b) => {
      if (dayjs(a.next).isBefore(dayjs(b.next))) {
        return -1;
      } else if (dayjs(a.next).isAfter(dayjs(b.next))) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  updateAllShows(): void {
    this.tvUpdateTaskService.downloadFollowedShows();
  }
}
