import { Either, left, right } from '@src/shared/core/either';

import { InvalidLatitudeError } from './errors/invalid-latitude-error';

export class Latitude {
  private readonly lat: number;
  private static readonly MIN_LATITUDE = -90;
  private static readonly MAX_LATITUDE = 90;

  private constructor(lat: number) {
    this.lat = lat;
  }

  get value(): number {
    return this.lat;
  }

  static validate(lat: number): boolean {
    return typeof lat === 'number' && lat >= this.MIN_LATITUDE && lat <= this.MAX_LATITUDE;
  }

  static create(lat: number): Either<InvalidLatitudeError, Latitude> {
    if (!this.validate(lat)) {
      return left(new InvalidLatitudeError(lat));
    }

    return right(new Latitude(lat));
  }
}
