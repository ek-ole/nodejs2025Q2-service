import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { LoggerModule } from 'src/commom/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: {
          expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
        },
      }),
    }),
    LoggerModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
