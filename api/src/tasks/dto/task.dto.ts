import { UserDto } from '@/auth/dto';
import { EpisodeDto, ShowDto } from '@/common/dto';

export class TaskDto {
  type?: 'notification' | 'showupdate';
  taskName?: string;
  next?: Date;
  user?: UserDto;
  show?: ShowDto;
  episode?: EpisodeDto;
}
