import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggingService } from '../logger/logging.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;
    const startTime = Date.now();

    this.loggingService.info(
      `Incoming request: ${method} ${originalUrl}`,
      'LoggingMiddleWare',
    );

    if (Object.keys(query).length > 0) {
      this.loggingService.debug(
        `Query parameters: ${JSON.stringify(query)}`,
        'LoggingMiddleware',
      );
    }

    if (Object.keys(body).length > 0) {
      const sanitizedBody = this.sanitizeBody(body);
      this.loggingService.debug(
        `Request body: ${JSON.stringify(sanitizedBody)}`,
        'LoggingMiddleware',
      );
    }

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      this.loggingService.info(
        `Response: ${method} ${originalUrl} - ${statusCode} (${duration}ms)`,
        'LoggingMiddleware',
      );
    });

    next();
  }

  private sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...body };
    if (sanitized.password) {
      sanitized.password = '***REDACTED***';
    }
    if (sanitized.oldPassword) {
      sanitized.oldPassword = '***REDACTED***';
    }
    if (sanitized.newPassword) {
      sanitized.newPassword = '***REDACTED***';
    }
    return sanitized;
  }
}
