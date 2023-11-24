import { IDomainError } from '@src/shared/errors/ports/domain-error';

export class InvalidJWTTokenError extends Error implements IDomainError {
  constructor() {
    super(`The JWT token is invalid.`);
    this.name = 'InvalidJWTTokenError';
  }
}
