import type { EpisodeDto, ShowDto, UserDto } from '@/types';

export class TaskDto {
  type?: 'notification' | 'showupdate';
  taskName?: string;
  next?: Date;
  user?: UserDto;
  show?: ShowDto;
  episode?: EpisodeDto;
}
