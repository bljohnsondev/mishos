import { Inject, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import * as dayjs from 'dayjs';

export abstract class CommonTaskService {
  abstract runTask(taskName: string): void;

  private readonly commonLogger = new Logger(CommonTaskService.name);

  @Inject() private schedulerRegistry: SchedulerRegistry;

  constructor() {}

  protected getCronJob(taskName: string): any {
    const jobs = this.schedulerRegistry.getCronJobs();
    return jobs.get(taskName);
  }

  protected schedule(taskName: string, runtime: Date): void {
    let job = this.getCronJob(taskName);

    if (!job) {
      job = new CronJob(runtime, () => this.runTask(taskName));
      this.schedulerRegistry.addCronJob(taskName, job);
      job.start();
    } else {
      job.setTime(new CronTime(runtime));
      job.start();
    }

    this.commonLogger.debug(`scheduling task [${taskName}] to run: ${dayjs(runtime).format('MM/DD/YYYY HH:mm:ss')}`);
  }

  protected stopTask(taskName: string) {
    const job = this.schedulerRegistry.getCronJob(taskName);
    job.stop();
  }

  protected stopAllTasks() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach(job => job.stop());

    const intervals = this.schedulerRegistry.getIntervals();
    intervals.forEach(interval => this.schedulerRegistry.deleteInterval(interval));

    const timeouts = this.schedulerRegistry.getTimeouts();
    timeouts.forEach(timeout => this.schedulerRegistry.deleteTimeout(timeout));
  }
}
