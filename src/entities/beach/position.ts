import { BeachPosition } from '@config/constants/beach-position-enum';
import { Either, left, right } from '@src/shared/logic/either';

import { InvalidPositionError } from './errors/invalid-position-error';

export class Position {
  private readonly position: string;

  private constructor(position: string) {
    this.position = position;
  }

  get value(): string {
    return this.position;
  }

  static getAllowedValues(): BeachPosition[] {
    return Object.values(BeachPosition).filter((value) => typeof value === 'string');
  }

  static validate(position: string): boolean {
    if (!position) {
      return false;
    }

    const allowedValues = this.getAllowedValues();

    if (!allowedValues.includes(position as BeachPosition)) {
      return false;
    }

    return true;
  }

  static create(position: string): Either<InvalidPositionError, Position> {
    if (!this.validate(position)) {
      return left(new InvalidPositionError(position));
    }

    return right(new Position(position));
  }
}
