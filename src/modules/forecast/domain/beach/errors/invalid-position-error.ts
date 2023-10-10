export class InvalidPositionError extends Error {
  constructor(position: string) {
    super(`The position "${position}" is invalid.`)
    this.name = 'InvalidPositionError'
  }
}
