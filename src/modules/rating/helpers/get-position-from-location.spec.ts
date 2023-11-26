import { BeachPosition } from '@config/constants/beach-position-enum';

import { getPositionFromLocation } from './get-position-from-location';

describe('getPositionFromLocation', () => {
  it('should be able get the point based on a east location', () => {
    const rating = getPositionFromLocation(92);

    expect(rating).toBe(BeachPosition.E);
  });

  it('should be able get the point based on a north location 1', () => {
    const rating = getPositionFromLocation(360);

    expect(rating).toBe(BeachPosition.N);
  });

  it('should be able get the point based on a north location 2', () => {
    const rating = getPositionFromLocation(40);

    expect(rating).toBe(BeachPosition.N);
  });

  it('should be able get the point based on a south location', () => {
    const rating = getPositionFromLocation(200);

    expect(rating).toBe(BeachPosition.S);
  });

  it('should be able get the point based on a west location', () => {
    const rating = getPositionFromLocation(300);

    expect(rating).toBe(BeachPosition.W);
  });
});
