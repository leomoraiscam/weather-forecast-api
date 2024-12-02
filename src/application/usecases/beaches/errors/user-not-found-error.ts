import { IUseCaseError } from '@src/shared/errors/ports/use-case-error';

export class UserNotFoundError extends Error implements IUseCaseError {
  constructor() {
    super('The user does not exist.');
    this.name = 'UserNotFoundError';
  }
}
