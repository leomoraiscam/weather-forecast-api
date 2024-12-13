import { TypesLogger } from '@src/application/contracts/providers/logger-provider/enums/types-logger-enum';

export interface ILoggerData {
  level: TypesLogger;
  message: string;
  metadata?: object;
}
