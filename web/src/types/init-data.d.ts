import type { UserConfigDto } from './dto/user-config.dto';
import type { UserDto } from './dto/user.dto';

export interface InitData {
  user?: UserDto;
  userConfig?: UserConfigDto;
}
