import pino, { Logger } from 'pino';

import {
  ILoggerData,
  ILoggerProvider,
} from '@src/application/interfaces/providers/logger-provider';

export class PinoLoggerProvider implements ILoggerProvider {
  private loggerService: Logger;

  log({ level, message, metadata }: ILoggerData): void {
    this.loggerService = pino({
      enabled: true,
      level,
    });

    this.loggerService[level]({ message, metadata });
  }
}
