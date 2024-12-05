import pino, { Logger } from 'pino';

import { ILoggerData } from '@src/application/contracts/providers/logger-provider/dtos/logger-data';
import { ILoggerProvider } from '@src/application/contracts/providers/logger-provider/logger-provider';

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
