export class AccountAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`The email "${email}" is already registered.`)
    this.name = 'AccountAlreadyExistsError'
  }
}
