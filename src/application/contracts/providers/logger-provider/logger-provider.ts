import { ILoggerData } from './dtos/logger-data';

export interface ILoggerProvider {
  log(data: ILoggerData): void;
}
