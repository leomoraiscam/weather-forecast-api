import { Longitude } from './longitude';

describe('Beach Longitude Object Value', () => {
  it('should accept valid longitude', () => {
    const longitudeOrError = Longitude.create(151.289824);

    expect(longitudeOrError.isRight()).toBeTruthy();
  });

  it('should reject lat when the same is not a number between -180 and 180', () => {
    const longitudeOrError = Longitude.create(249.99999999);

    expect(longitudeOrError.isLeft()).toBeTruthy();
  });
});
