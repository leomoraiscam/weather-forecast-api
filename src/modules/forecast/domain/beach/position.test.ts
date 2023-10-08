import { BeachPosition } from "@config/constants/beach-position-enum";
import { Position } from "./position";
import { InvalidPositionError } from "./errors/invalid-position-error"

describe('Beach Position Object Value', () => {
  it('should accept valid position', () => {
    const positionOrError = Position.create(BeachPosition.E);

    expect(positionOrError).toHaveProperty('position');
  })

  it('should reject position when teh same not equal beach Position valid', () => {
    expect(() => Position.create('G')).toThrow(InvalidPositionError);
  })
})