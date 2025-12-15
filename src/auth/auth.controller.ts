import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoggingService } from 'src/commom/logger/logging.service';
import { Public } from './decorators/public.decorator';
import { TokensDto } from './dto/tokens.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggingService: LoggingService,
  ) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async signup(@Body() signupDto: SignupDto): Promise<User> {
    this.loggingService.info(
      `Signup request for login: ${signupDto.login}`,
      'AuthController',
    );

    const result = await this.authService.signup(signupDto);

    this.loggingService.info(
      `Signup successful for login: ${signupDto.login}`,
      'AuthController',
    );

    return result;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginDto: LoginDto): Promise<TokensDto> {
    this.loggingService.info(
      `Login request for login: ${loginDto.login}`,
      'AuthController',
    );

    const tokens = await this.authService.login(loginDto);

    this.loggingService.info(
      `Login successful for login: ${loginDto.login}`,
      'AuthController',
    );

    return tokens;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokensDto> {
    this.loggingService.info('Refresh token request', 'AuthController');

    const tokens = await this.authService.refresh(refreshTokenDto);

    this.loggingService.info('Token refresh successful', 'AuthController');

    return tokens;
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
    this.loggingService.info('Logout request', 'AuthController');

    await this.authService.logout(refreshTokenDto.refreshToken);
  }
}
