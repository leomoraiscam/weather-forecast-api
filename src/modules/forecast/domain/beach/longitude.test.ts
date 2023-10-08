import { Longitude } from "./longitude";
import { InvalidLongitudeError } from "./errors/invalid-longitude-error"

describe('Beach Longitude Object Value', () => {
  it('should accept valid longitude', () => {
    const latitudeOrError = Longitude.create(151.289824);

    expect(latitudeOrError).toHaveProperty('lng');
  })

  it('should reject lat when the same is not a number between -180 and 180', () => {
    expect(() => Longitude.create(249.99999999)).toThrow(InvalidLongitudeError);
  })
})