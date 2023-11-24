import { TypesLogger } from '@config/constants/types-logger-enum';

export interface ILoggerData {
  level: TypesLogger;
  message: string;
  metadata?: object;
}

export interface ILoggerService {
  log({ level, message, metadata }: ILoggerData): void;
}
