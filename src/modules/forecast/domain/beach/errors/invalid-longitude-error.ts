import { DomainError } from "@src/shared/errors/ports/domain-error"

export class InvalidLongitudeError extends Error implements DomainError {
  constructor(lng: number) {
    super(`The lng "${lng}" is invalid.`)
    this.name = 'InvalidLongitudeError'
  }
}
