import { Injectable } from '@nestjs/common';

import { UserDto } from '@/auth/dto/user.dto';
import { User } from '@/common/entity';
import { Mapper } from '@/common/interfaces';

@Injectable()
export class UserMapper implements Mapper<User, UserDto> {
  public toDto(user: User): UserDto {
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };
  }
}
