import { IUseCaseError } from '@src/shared/errors/use-case-error';

export class BeachAlreadyExistsError extends Error implements IUseCaseError {
  constructor(data: string) {
    super(`The geolocation "${data}" is already registered.`);
    this.name = 'BeachAlreadyExistsError';
  }
}
