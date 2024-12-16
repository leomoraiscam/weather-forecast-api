import { IDomainError } from '@src/shared/errors/domain-error';

export class InvalidEmailError extends Error implements IDomainError {
  constructor(email: string) {
    super(`The email "${email}" is invalid.`);
    this.name = 'InvalidEmailError';
  }
}
