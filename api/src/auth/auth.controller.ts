import { Body, Controller, Get, Post, Request } from '@nestjs/common';

import { Public } from '@/common/decorators';
import { User } from '@/common/entity';
import { UserMapper } from '@/common/mapper';

import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto, UserDto } from './dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userMapper: UserMapper) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto.username, loginDto.password);
  }

  @Public()
  @Get('onboarding/ready')
  async onboardingReady() {
    const ready = await this.authService.isOnboardingReady();
    return { ready };
  }

  @Public()
  @Post('onboarding/create')
  async onboardingCreate(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.onboardingCreate(loginDto.username, loginDto.password);
  }

  @Get('user')
  async currentUser(@Request() req): Promise<UserDto> {
    const user: User | null = await this.authService.findUserById(req.user.id);
    return this.userMapper.toDto(user);
  }
}
