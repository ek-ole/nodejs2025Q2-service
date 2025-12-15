import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoggingService } from 'src/commom/logger/logging.service';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly loggingService: LoggingService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.loggingService.warn(
        `Unauthorized access attempt - no token: ${request.method} ${request.url}`,
        'JwtAuthGard',
      );
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      request['user'] = payload;

      this.loggingService.debug(
        `Authorized access for user: ${payload.login} (${payload.sub}) - ${request.method} ${request.url}`,
        'JwtAuthGuard',
      );

      return true;
    } catch (error) {
      this.loggingService.error(
        `Invalid token for request: ${request.method} ${request.url}`,
        error,
        'JwtAuthGuard',
      );
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader || typeof authHeader !== 'string') {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
