import { IUseCaseError } from '@src/shared/errors/use-case-error';

export class AccountAlreadyExistsError extends Error implements IUseCaseError {
  public readonly name = 'AccountAlreadyExistsError';

  constructor() {
    super(`User already registered`);
  }
}
