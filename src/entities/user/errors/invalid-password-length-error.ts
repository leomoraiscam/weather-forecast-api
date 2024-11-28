import { IDomainError } from '@src/shared/errors/ports/domain-error';

export class InvalidPasswordLengthError extends Error implements IDomainError {
  constructor() {
    super(`The password must have between 6 and 20 characters.`);
    this.name = 'InvalidPasswordLengthError';
  }
}
