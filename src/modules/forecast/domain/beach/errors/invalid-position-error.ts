import { DomainError } from "@src/shared/errors/ports/domain-error"

export class InvalidPositionError extends Error implements DomainError {
  constructor(position: string) {
    super(`The position "${position}" is invalid.`)
    this.name = 'InvalidPositionError'
  }
}
