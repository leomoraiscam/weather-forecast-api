import { IDomainError } from '@src/shared/errors/ports/domain-error';

export class InvalidLatitudeError extends Error implements IDomainError {
  constructor(lat: number) {
    super(`The lat "${lat}" is invalid.`);
    this.name = 'InvalidLatitudeError';
  }
}
