export class StormGlassResponseError extends Error {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error returned by the StormGlass service';
      
    super(`${internalMessage}${message}`);
  }
}