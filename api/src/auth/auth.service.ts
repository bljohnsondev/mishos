import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';

import { User, UserConfig } from '@/common/entity';
import { UserMapper } from '@/common/mapper';

import { LoginResponseDto, UserDto } from './dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly userMapper: UserMapper
  ) {}

  async findUser(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username },
      relations: {
        config: true,
      },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      relations: {
        config: true,
      },
    });
  }

  async login(username: string, password: string): Promise<LoginResponseDto> {
    if (!username || !password) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const userDto: UserDto = this.userMapper.toDto(user);

    return {
      user: userDto,
      token: await this.jwtService.signAsync(userDto),
    };
  }

  async isOnboardingReady(): Promise<boolean> {
    const count = await this.userRepository.count();
    return count === 0;
  }

  async onboardingCreate(username: string, password: string): Promise<LoginResponseDto> {
    if (!username || !password) {
      throw new UnauthorizedException();
    }

    // no funny business! onboarding should only happen when there are no users
    const count = await this.userRepository.count();
    if (count > 0) {
      this.logger.warn(`Attempt made to create a new onboarding user: ${username}`);
      throw new UnauthorizedException();
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const initUser = new User();
    initUser.username = username;
    initUser.password = encryptedPassword;

    const config = await this.dataSource.manager.save(new UserConfig());
    initUser.config = config;

    const user = await this.dataSource.manager.save(initUser);
    const userDto: UserDto = this.userMapper.toDto(user);

    return {
      user: userDto,
      token: await this.jwtService.signAsync(userDto),
    };
  }
}
