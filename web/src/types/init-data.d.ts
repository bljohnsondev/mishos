import type { UserDto } from './dto/user.dto';
import type { UserConfigDto } from './dto/user-config.dto';

export interface InitData {
  user?: UserDto;
  userConfig?: UserConfigDto;
}
