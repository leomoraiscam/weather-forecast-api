import { UseCaseError } from '@src/shared/errors/ports/use-case-error';

export class StormGlassResponseError extends Error implements UseCaseError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error returned by the StormGlass service';

    super(`${internalMessage}${message}`);
  }
}
