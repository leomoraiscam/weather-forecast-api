import {
  ILoggerData,
  ILoggerProvider,
} from '@src/application/interfaces/providers/logger-provider';

export class InMemoryLoggerProvider implements ILoggerProvider {
  log(_: Partial<ILoggerData>): void {}
}
