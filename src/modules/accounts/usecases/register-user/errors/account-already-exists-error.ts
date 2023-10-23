import { UseCaseError } from "@src/shared/errors/ports/use-case-error"

export class AccountAlreadyExistsError extends Error implements UseCaseError {
  constructor(email: string) {
    super(`The email "${email}" is already registered.`)
    this.name = 'AccountAlreadyExistsError'
  }
}
