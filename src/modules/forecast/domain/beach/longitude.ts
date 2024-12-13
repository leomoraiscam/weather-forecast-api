import { Either, left, right } from '@src/shared/core/either';

import { InvalidLongitudeError } from './errors/invalid-longitude-error';

export class Longitude {
  private readonly lng: number;

  private constructor(lng: number) {
    this.lng = lng;
  }

  get value(): number {
    return this.lng;
  }

  static validate(lng: number): boolean {
    const lngRegex =
      /^(\+|-)?((\d((\.)|\.\d{1,6})?)|(0*?\d\d((\.)|\.\d{1,6})?)|(0*?1[0-7]\d((\.)|\.\d{1,6})?)|(0*?180((\.)|\.0{1,6})?))$/;

    if (!lng) {
      return false;
    }

    if (!lngRegex.test(String(lng))) {
      return false;
    }

    return true;
  }

  static create(lng: number): Either<InvalidLongitudeError, Longitude> {
    if (!this.validate(lng)) {
      return left(new InvalidLongitudeError(lng));
    }

    return right(new Longitude(lng));
  }
}
