import { Either, left, right } from "@src/shared/logic/Either";
import { InvalidLatitudeError } from "./errors/invalid-latitude-error";

export class Latitude {
  private readonly lat: number;

  private constructor(lat: number) {
    this.lat = lat;
  }

  get value(): number {
    return this.lat;
  }

  static validate(lat: number): boolean {
    const latRegex = 
      /^(\+|-)?((\d((\.)|\.\d{1,6})?)|(0*?[0-8]\d((\.)|\.\d{1,6})?)|(0*?90((\.)|\.0{1,6})?))$/

    if (!lat) {
      return false
    }
    
    if (!latRegex.test(String(lat))) {
      return false;
    }

    return true
  }

  static create(lat: number): Either<InvalidLatitudeError, Latitude> {
    if (!this.validate(lat)) {
      return left(new InvalidLatitudeError(lat))
    }

    return right(new Latitude(lat));
  }
}