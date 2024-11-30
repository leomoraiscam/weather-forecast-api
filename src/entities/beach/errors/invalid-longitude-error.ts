import { IDomainError } from '@src/shared/errors/ports/domain-error';

export class InvalidLongitudeError extends Error implements IDomainError {
  constructor(lng: number) {
    super(`The lng "${lng}" is invalid.`);
    this.name = 'InvalidLongitudeError';
  }
}