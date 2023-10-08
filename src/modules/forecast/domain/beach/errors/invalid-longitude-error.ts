export class InvalidLongitudeError extends Error {
  constructor(lng: number) {
    super(`The lng "${lng}" is invalid.`)
    this.name = 'InvalidLongitudeError'
  }
}
