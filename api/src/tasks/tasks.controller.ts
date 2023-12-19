import { Controller, Get } from '@nestjs/common';

import { TaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';

@Controller('/api/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('')
  async getTaskList(): Promise<TaskDto[]> {
    return await this.tasksService.findTasks();
  }

  @Get('updateshows')
  updateAllShows(): void {
    this.tasksService.updateAllShows();
  }
}
