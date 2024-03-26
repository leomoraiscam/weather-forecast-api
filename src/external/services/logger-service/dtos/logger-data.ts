import { TypesLogger } from '@config/constants/types-logger-enum';

export interface ILoggerData {
  level: TypesLogger;
  message: string;
  metadata?: object;
}
