import { Injectable, Scope } from '@nestjs/common';
import { getLoggerConfig, LoggerConfig } from './logger.config';
import { LogLevel } from './log-level.enum';

@Injectable({ scope: Scope.DEFAULT })
export class LoggingService {
  private config: LoggerConfig;

  constructor() {
    this.config = getLoggerConfig();
    this.ensureLogsDirectory();
  }

  private ensureLogsDirectory(): void {}

  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.level;
  }

  private formatMessage(
    level: string,
    message: string,
    context?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    return `[${timestamp}] ${level.toUpperCase()}${contextStr}: ${message}`;
  }

  error(message: string, error?: Error | string, context?: string): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const formatted = this.formatMessage('error', message, context);
      console.error(formatted);
      if (error) {
        if (error instanceof Error) {
          console.error(error.message);
          console.error(error.stack);
        } else {
          console.error(error);
        }
      }
    }
  }

  warn(message: string, context?: string): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  info(message: string, context?: string): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage('info', message, context));
    }
  }

  debug(message: string, context?: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  verbose(message: string, context: string): void {
    if (this.shouldLog(LogLevel.VERBOSE)) {
      console.log(this.formatMessage('verbose', message, context));
    }
  }
}
