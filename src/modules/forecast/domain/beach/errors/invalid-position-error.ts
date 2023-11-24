import { IDomainError } from '@src/shared/errors/ports/domain-error';

export class InvalidPositionError extends Error implements IDomainError {
  constructor(position: string) {
    super(`The position "${position}" is invalid.`);
    this.name = 'InvalidPositionError';
  }
}
