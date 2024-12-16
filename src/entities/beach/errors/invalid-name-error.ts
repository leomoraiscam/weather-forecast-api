import { IDomainError } from '@src/shared/errors/domain-error';

export class InvalidNameError extends Error implements IDomainError {
  constructor(name: string) {
    super(`The name "${name}" is invalid.`);
    this.name = 'InvalidNameError';
  }
}
