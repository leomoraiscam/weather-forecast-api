import { Either, left, right } from '@src/shared/logic/either';

import { InvalidLongitudeError } from './errors/invalid-longitude-error';

export class Longitude {
  private readonly lng: number;
  private static readonly MIN_LONGITUDE = -180;
  private static readonly MAX_LONGITUDE = 180;

  private constructor(lng: number) {
    this.lng = lng;
  }

  get value(): number {
    return this.lng;
  }

  static validate(lng: number): boolean {
    return typeof lng === 'number' && lng >= this.MIN_LONGITUDE && lng <= this.MAX_LONGITUDE;
  }

  static create(lng: number): Either<InvalidLongitudeError, Longitude> {
    if (!this.validate(lng)) {
      return left(new InvalidLongitudeError(lng));
    }

    return right(new Longitude(lng));
  }
}
