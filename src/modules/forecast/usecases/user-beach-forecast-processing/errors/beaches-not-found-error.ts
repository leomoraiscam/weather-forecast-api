import { IUseCaseError } from '@src/shared/errors/ports/use-case-error';

export class BeachesNotFoundError extends Error implements IUseCaseError {
  constructor() {
    super(`The does not exist beaches to specific user.`);
    this.name = 'BeachesNotFound';
  }
}
