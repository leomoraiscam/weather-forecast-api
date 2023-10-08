import { BeachPosition } from "@config/constants/beach-position-enum";
import { InvalidPositionError } from "./errors/invalid-position-error"

export class Position {
  private readonly position: string;

  private constructor(position: string) {
    this.position = position;
  }

  get value(): string {
    return this.position;
  }

  static validate(position: string): boolean {
    if(!position) {
      return false
    }

    const values = Object.values(BeachPosition);

    if (!values.includes(`${position}` as unknown as BeachPosition)) {
      return false
    }

    return true
  }

  static create(position: string): Position | InvalidPositionError{
    if (!this.validate(position)) {
      throw new InvalidPositionError(position)
    }

    return new Position(position);
  }
}