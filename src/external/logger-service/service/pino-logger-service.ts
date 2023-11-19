import pino, { Logger } from 'pino';
import { LoggerService, LoggerData, TypesLogger } from '../ports/logger-service';

export class WinstonLoggerService implements LoggerService {
  private loggerService: Logger;

  log({ level, message, metadata }: LoggerData): void {
    this.loggerService = pino({
      enabled: true,
      level,
    });

    this.loggerService[level]({ message, metadata });
  }
}
