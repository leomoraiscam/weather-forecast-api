import { IUseCaseError } from '@src/shared/errors/ports/use-case-error';

export class BeachNotFoundError extends Error implements IUseCaseError {
  constructor() {
    super('The beach does not exist.');
    this.name = 'BeachesNotFound';
  }
}
