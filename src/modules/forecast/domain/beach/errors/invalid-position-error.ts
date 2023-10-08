export class InvalidPositionError extends Error {
  constructor(position: string) {
    super(`The name "${position}" is invalid.`)
    this.name = 'InvalidPositionError'
  }
}
