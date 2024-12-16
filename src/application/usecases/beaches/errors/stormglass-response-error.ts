import { IUseCaseError } from '@src/shared/errors/use-case-error';

export class StormGlassResponseError extends Error implements IUseCaseError {
  constructor() {
    super(`Unexpected error returned by the StormGlass service`);
    this.name = 'StormGlassResponseError';
  }
}
