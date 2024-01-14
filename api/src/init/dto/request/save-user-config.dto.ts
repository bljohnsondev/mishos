import { IsNotEmpty } from 'class-validator';

import { UserConfigDto } from '@/common/dto';

export class SaveUserConfigDto {
  @IsNotEmpty()
  userConfig: UserConfigDto;
}
