import { LoggingService } from './logging.service';

export class GlobalErrorHandler {
  private static loggingService: LoggingService;

  static initialize(loggingService: LoggingService) {
    this.loggingService = loggingService;
    this.setupUncaughtExceptionHandler();
    this.setupUnhandledRejectionHandler();
  }

  private static setupUncaughtExceptionHandler() {
    process.on('uncaughtException', (error: Error) => {
      this.loggingService.error(
        'Uncaught Exception occurred',
        error,
        'GlobalErrorHandler',
      );

      console.error('Exiting due to uncaught exception...');
      process.exit(1);
    });
  }

  private static setupUnhandledRejectionHandler() {
    process.on(
      'unhandledRejection',
      (reason: unknown, promise: Promise<unknown>) => {
        const error =
          reason instanceof Error
            ? reason
            : new Error(`Unhandled rejection: ${String(reason)}`);

        this.loggingService.error(
          `Unhandled Rejection at: ${promise}`,
          error,
          'GlobalErrorHandler',
        );
      },
    );
  }
}
