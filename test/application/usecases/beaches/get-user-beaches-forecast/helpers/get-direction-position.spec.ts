import { BeachPosition } from '@src/shared/enums/beach-position-enum';
import { getDirectionPosition } from '@src/application/usecases/beaches/get-user-beaches-forecast/helpers/get-direction-position';

describe('Get position from location helper', () => {
  it('should be able to get the point based on a east location', () => {
    const position = getDirectionPosition(92);

    expect(position).toBe(BeachPosition.E);
  });

  it('should be able to get the point based on a north location 1', () => {
    const position = getDirectionPosition(360);

    expect(position).toBe(BeachPosition.N);
  });

  it('should be able to get the point based on a north location 2', () => {
    const position = getDirectionPosition(40);

    expect(position).toBe(BeachPosition.N);
  });

  it('should be able to get the point based on a south location', () => {
    const position = getDirectionPosition(200);

    expect(position).toBe(BeachPosition.S);
  });

  it('should be able to get the point based on a west location', () => {
    const position = getDirectionPosition(300);

    expect(position).toBe(BeachPosition.W);
  });
});
