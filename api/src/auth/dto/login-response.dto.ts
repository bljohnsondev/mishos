import { UserDto } from '@/auth/dto';

export class LoginResponseDto {
  user: UserDto;
  token: string;
}
