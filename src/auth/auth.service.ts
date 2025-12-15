import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoggingService } from 'src/commom/logger/logging.service';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { SignupDto } from './dto/signup.dto';
import { TokensDto } from './dto/tokens.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly loggingService: LoggingService,
  ) {}

  async signup(signupDto: SignupDto): Promise<User> {
    const { login, password } = signupDto;

    this.loggingService.info(
      `Attempting signup for login: ${login}`,
      'AuthService',
    );
    const existingUser = await this.usersRepository.findOne({
      where: { login },
    });

    if (existingUser) {
      this.loggingService.error(
        `User with login ${login} already exists`,
        undefined,
        'AuthService',
      );
      throw new ConflictException('User with this login already exists');
    }

    const saltRounds = parseInt(process.env.CRYPT_SALT || '10');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = this.usersRepository.create({
      login,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    this.loggingService.info(
      `User created with id: ${savedUser.id}`,
      'AuthService',
    );

    return savedUser;
  }

  async login(loginDto: LoginDto): Promise<TokensDto> {
    const { login, password } = loginDto;

    this.loggingService.info(
      `Attempting login for user: ${login}`,
      'AuthService',
    );

    const user = await this.usersRepository.findOne({
      where: { login },
    });

    if (!user) {
      this.loggingService.error(
        `Login failed - user not found: ${login}`,
        undefined,
        'AuthService',
      );
      throw new UnauthorizedException('Invalid login or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.loggingService.error(
        `Login failed - invalid password for user: ${login}`,
        undefined,
        'AuthService',
      );
      throw new UnauthorizedException('Invalid login or password');
    }

    this.loggingService.info(
      `Login successful for user: ${login} (id: ${user.id})`,
      'AuthService',
    );

    return this.generateTokens(user);
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<TokensDto> {
    const { refreshToken } = refreshTokenDto;

    this.loggingService.info('Attempting token refresh', 'AuthService');

    const tokenEntity = await this.validateRefreshToken(refreshToken);

    await this.refreshTokensRepository.delete(tokenEntity.id);

    this.loggingService.info(
      `Token refresh successful for user: ${tokenEntity.user.login}`,
      'AuthService',
    );

    return this.generateTokens(tokenEntity.user);
  }

  async logout(refreshToken: string): Promise<void> {
    this.loggingService.info('Attempting logout', 'AuthService');

    const result = await this.refreshTokensRepository.delete({
      token: refreshToken,
    });

    if (result.affected === 0) {
      this.loggingService.warn(
        `Logout attempt with invalid refresh token`,
        'AuthService',
      );

      return;
    }

    this.loggingService.info('Logout successful', 'AuthService');
  }

  private async generateTokens(user: User): Promise<TokensDto> {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      login: user.login,
    };

    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
    });
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const token = crypto.randomBytes(40).toString('hex');

    const expiresInDays = parseInt(
      process.env.TOKEN_REFRESH_EXPIRE_TIME?.replace('d', '') || '7',
    );
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const refreshTokenEntity = this.refreshTokensRepository.create({
      token,
      userId: user.id,
      expiresAt,
    });

    await this.refreshTokensRepository.save(refreshTokenEntity);

    return token;
  }

  private async validateRefreshToken(token: string): Promise<RefreshToken> {
    const refreshToken = await this.refreshTokensRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (refreshToken.expiresAt < new Date()) {
      await this.refreshTokensRepository.delete(refreshToken.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    return refreshToken;
  }
}
