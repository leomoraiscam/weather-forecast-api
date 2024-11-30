import { Latitude } from '@src/entities/beach/latitude';

describe('Beach latitude object value', () => {
  it('should be able to accept valid latitude', () => {
    const latitudeOrError = Latitude.create(-33.792726);

    expect(latitudeOrError.isRight()).toBeTruthy();
  });

  it('should be able to reject empty latitude', () => {
    const latitudeOrError = Latitude.create(null);

    expect(latitudeOrError.isLeft()).toBeTruthy();
  });

  it('should be able to reject lat when the same is not a number between -90 and 90', () => {
    const latitudeOrError = Latitude.create(151.289824);

    expect(latitudeOrError.isLeft()).toBeTruthy();
  });
});
