import { DomainError } from "@src/shared/errors/ports/domain-error"

export class InvalidPasswordLengthError extends Error implements DomainError {
  constructor() {
    super(`The password must have between 6 and 255 characters.`)
    this.name = 'InvalidPasswordLengthError'
  }
}
