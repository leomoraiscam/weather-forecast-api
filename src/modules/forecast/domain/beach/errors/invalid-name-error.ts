import { DomainError } from "@src/shared/errors/ports/domain-error"

export class InvalidNameError extends Error  implements DomainError{
  constructor(name: string) {
    super(`The name "${name}" is invalid.`)
    this.name = 'InvalidNameError'
  }
}
