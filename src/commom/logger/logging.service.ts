import { Injectable, OnModuleDestroy, Scope } from '@nestjs/common';
import { getLoggerConfig, LoggerConfig } from './logger.config';
import { LogLevel } from './log-level.enum';
import * as fs from 'fs';
import * as path from 'path';

@Injectable({ scope: Scope.DEFAULT })
export class LoggingService implements OnModuleDestroy {
  private config: LoggerConfig;
  private errorLogStream: fs.WriteStream | null = null;
  private combinedLogStream: fs.WriteStream | null = null;

  constructor() {
    this.config = getLoggerConfig();
    this.ensureLogsDirectory();
    this.initializeLogStreams();
  }

  private ensureLogsDirectory(): void {
    const logsDir = path.dirname(
      this.config.combinedLogFile || 'logs/combined.log',
    );
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  private initializeLogStreams(): void {
    if (this.config.combinedLogFile) {
      this.combinedLogStream = fs.createWriteStream(
        this.config.combinedLogFile,
        { flags: 'a' },
      );
    }

    if (this.config.errorLogFile) {
      this.errorLogStream = fs.createWriteStream(this.config.errorLogFile, {
        flags: 'a',
      });
    }
  }

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
    return `[${timestamp}] ${level.toUpperCase()}${contextStr}: ${message}\n`;
  }

  private writeToFile(message: string, level: LogLevel): void {
    if (this.combinedLogStream && this.combinedLogStream.writable) {
      this.combinedLogStream.write(message);

      this.rotateFileIfNeeded(
        this.config.combinedLogFile!,
        this.combinedLogStream,
      );
    }

    if (
      level === LogLevel.ERROR &&
      this.errorLogStream &&
      this.errorLogStream.writable
    ) {
      this.errorLogStream.write(message);
      this.rotateFileIfNeeded(this.config.errorLogFile!, this.errorLogStream);
    }
  }

  private rotateFileIfNeeded(filePath: string, stream: fs.WriteStream): void {
    try {
      const stats = fs.statSync(filePath);
      const fileSizeInKB = stats.size / 1024;

      if (fileSizeInKB >= (this.config.maxFileSize || 10240)) {
        stream.end();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = `${filePath}.${timestamp}.bak`;
        fs.renameSync(filePath, backupFile);

        const newStream = fs.createWriteStream(filePath, { flags: 'a' });

        if (filePath === this.config.combinedLogFile) {
          this.combinedLogStream = newStream;
        } else if (filePath === this.config.errorLogFile) {
          this.errorLogStream = newStream;
        }
      }
    } catch (error) {}
  }

  private log(
    level: LogLevel,
    message: string,
    error?: Error | string,
    context?: string,
  ): void {
    if (!this.shouldLog(level)) return;

    const formatted = this.formatMessage(
      LogLevel[level].toLowerCase(),
      message,
      context,
    );
    if (level === LogLevel.ERROR) {
      console.error(formatted.trim());
      if (error) {
        if (error instanceof Error) {
          console.error(error.message);
          console.error(error.stack);
        } else {
          console.error(error);
        }
      }
    } else if (level === LogLevel.WARN) {
      console.warn(formatted.trim());
    } else {
      console.log(formatted.trim());
    }
    this.writeToFile(formatted, level);
    if (level === LogLevel.ERROR && error) {
      const errorFormatted =
        error instanceof Error
          ? `Stack trace: ${error.stack}\n`
          : `Error details: ${error}\n`;
      this.writeToFile(errorFormatted, level);
    }
  }

  error(message: string, error?: Error | string, context?: string): void {
    this.log(LogLevel.ERROR, message, error, context);
  }

  warn(message: string, context?: string): void {
    this.log(LogLevel.WARN, message, undefined, context);
  }

  info(message: string, context?: string): void {
    this.log(LogLevel.INFO, message, undefined, context);
  }

  debug(message: string, context?: string): void {
    this.log(LogLevel.DEBUG, message, undefined, context);
  }

  verbose(message: string, context?: string): void {
    this.log(LogLevel.VERBOSE, message, undefined, context);
  }

  async onModuleDestroy() {
    console.log('Closing log files...');
  }
}
