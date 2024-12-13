import { TypesLogger } from '../enums/types-logger-enum';

export interface ILoggerData {
  level: TypesLogger;
  message: string;
  metadata?: object;
}
