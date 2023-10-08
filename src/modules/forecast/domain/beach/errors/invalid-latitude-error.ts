export class InvalidLatitudeError extends Error {
  constructor(lat: number) {
    super(`The lat "${lat}" is invalid.`)
    this.name = 'InvalidLatitudeError'
  }
}
