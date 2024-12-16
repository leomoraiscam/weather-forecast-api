import { IUseCaseError } from '@src/shared/errors/use-case-error';

export class InvalidEmailOrPasswordError extends Error implements IUseCaseError {
  constructor() {
    super(`Invalid e-mail/password combination.`);
    this.name = 'InvalidEmailOrPasswordError';
  }
}
