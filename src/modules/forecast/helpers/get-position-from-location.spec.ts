import { BeachPosition } from '@config/constants/beach-position-enum';

import { getPositionFromLocation } from './get-position-from-location';

describe('Get position from location helper', () => {
  it('should be able get the point based on a east location', () => {
    const position = getPositionFromLocation(92);

    expect(position).toBe(BeachPosition.E);
  });

  it('should be able get the point based on a north location 1', () => {
    const position = getPositionFromLocation(360);

    expect(position).toBe(BeachPosition.N);
  });

  it('should be able get the point based on a north location 2', () => {
    const position = getPositionFromLocation(40);

    expect(position).toBe(BeachPosition.N);
  });

  it('should be able get the point based on a south location', () => {
    const position = getPositionFromLocation(200);

    expect(position).toBe(BeachPosition.S);
  });

  it('should be able get the point based on a west location', () => {
    const position = getPositionFromLocation(300);

    expect(position).toBe(BeachPosition.W);
  });
});
