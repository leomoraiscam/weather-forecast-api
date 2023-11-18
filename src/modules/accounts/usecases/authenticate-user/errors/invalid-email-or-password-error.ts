import { UseCaseError } from '@src/shared/errors/ports/use-case-error';

export class InvalidEmailOrPasswordError extends Error implements UseCaseError {
  constructor() {
    super(`Invalid e-mail/password combination.`);
    this.name = 'InvalidEmailOrPasswordError';
  }
}
