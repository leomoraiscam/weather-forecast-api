import { DomainError } from '@src/shared/errors/ports/domain-error';

export class InvalidEmailError extends Error implements DomainError {
  constructor(email: string) {
    super(`The email "${email}" is invalid.`);
    this.name = 'InvalidEmailError';
  }
}
