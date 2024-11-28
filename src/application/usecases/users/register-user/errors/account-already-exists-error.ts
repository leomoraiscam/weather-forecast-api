export class AccountAlreadyExistsError extends Error {
  public readonly name = 'AccountAlreadyExistsError';

  constructor() {
    super(`User already registered`);
  }
}
