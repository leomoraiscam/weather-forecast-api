import pino, { Logger } from 'pino';

import { ILoggerService, ILoggerData } from '../ports/logger-service';

export class WinstonLoggerService implements ILoggerService {
  private loggerService: Logger;

  log({ level, message, metadata }: ILoggerData): void {
    this.loggerService = pino({
      enabled: true,
      level,
    });

    this.loggerService[level]({ message, metadata });
  }
}
