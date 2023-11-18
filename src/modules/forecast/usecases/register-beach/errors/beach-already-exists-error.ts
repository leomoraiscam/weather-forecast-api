import { UseCaseError } from '@src/shared/errors/ports/use-case-error';

export class BeachAlreadyExistsError extends Error implements UseCaseError {
  constructor(data: string) {
    super(`The geolocation "${data}" is already registered.`);
    this.name = 'BeachAlreadyExistsError';
  }
}
