export class TooManyRequestsError extends Error {
  constructor() {
    super(`To Many request.`);
    this.name = 'TooManyRequestsError';
  }
}
