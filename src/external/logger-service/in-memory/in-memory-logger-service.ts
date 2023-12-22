import { ILoggerData } from '../dtos/logger-data';
import { ILoggerService } from '../ports/logger-service';

export class InMemoryLoggerService implements ILoggerService {
  log(_: Partial<ILoggerData>): void {}
}
