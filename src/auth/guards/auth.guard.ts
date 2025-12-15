import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { LoggingService } from 'src/commom/logger/logging.service';

@Injectable()
export class AuthGuard extends JwtAuthGuard {
  constructor(
    private readonly reflector: Reflector,
    jwtService: JwtService,
    loggingService: LoggingService,
  ) {
    super(jwtService, loggingService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
