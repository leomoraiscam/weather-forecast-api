export class InvalidEmailOrPasswordError extends Error {
  constructor() {
    super(`Invalid e-mail/password combination.`)
    this.name = 'InvalidEmailOrPasswordError'
  }
}
