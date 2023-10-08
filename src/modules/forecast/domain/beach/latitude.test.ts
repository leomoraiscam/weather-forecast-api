import { Latitude } from "./latitude";
import { InvalidLatitudeError } from "./errors/invalid-latitude-error"

describe('Beach Latitude Object Value', () => {
  it('should accept valid latitude', () => {
    const latitudeOrError = Latitude.create(-33.792726);

    expect(latitudeOrError).toHaveProperty('lat');
  })

  it('should reject lat when the same is not a number between -90 and 90', () => {
    expect(() => Latitude.create(151.289824)).toThrow(InvalidLatitudeError);
  })
})