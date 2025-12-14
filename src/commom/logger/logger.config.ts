import { LogLevel } from './log-level.enum';

export interface LoggerConfig {
  level: LogLevel;
  maxFileSize?: number;
  errorLogFile?: string;
  combinedLogFile?: string;
}

export const getLoggerConfig = (): LoggerConfig => {
  const level = process.env.Log_Level || 'info';

  return {
    level: LogLevel[level.toUpperCase()] || LogLevel.INFO,
    maxFileSize: parseInt(process.env.LOG_MAX_FILE_SIZE || '10240'),
    errorLogFile: process.env.LOG_ERROR_FILE || 'logs/error.log',
    combinedLogFile: process.env.LOG_COMBINED_FILE || 'logs/combined.log',
  };
};
