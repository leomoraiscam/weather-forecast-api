import { Longitude } from './longitude';

describe('Beach longitude object value', () => {
  it('should be able to accept valid longitude', () => {
    const longitudeOrError = Longitude.create(151.289824);

    expect(longitudeOrError.isRight()).toBeTruthy();
  });

  it('should be able to reject empty longitude', () => {
    const longitudeOrError = Longitude.create(null);

    expect(longitudeOrError.isLeft()).toBeTruthy();
  });

  it('should be able to reject lat when the same is not a number between -180 and 180', () => {
    const longitudeOrError = Longitude.create(249.99999999);

    expect(longitudeOrError.isLeft()).toBeTruthy();
  });
});
