import { ILoggerData } from '@src/application/contracts/providers/logger-provider/dtos/logger-data';
import { ILoggerProvider } from '@src/application/contracts/providers/logger-provider/logger-provider';

export class InMemoryLoggerProvider implements ILoggerProvider {
  log(_: Partial<ILoggerData>): void {}
}
