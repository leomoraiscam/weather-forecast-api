import { ILoggerData } from '../dtos/logger-data';

export interface ILoggerService {
  log({ level, message, metadata }: ILoggerData): void;
}
