import { BeachPosition } from '@config/constants/beach-position-enum';
import { Position } from '@src/entities/beach/position';

describe('Beach position object value', () => {
  it('should be able to accept valid position', () => {
    const positionOrError = Position.create(BeachPosition.E);

    expect(positionOrError.isRight()).toBeTruthy();
  });

  it('should be able to reject empty position', () => {
    const positionOrError = Position.create(null);

    expect(positionOrError.isLeft()).toBeTruthy();
  });

  it('should be able to reject position when teh same not equal beach Position valid', () => {
    const positionOrError = Position.create('G');

    expect(positionOrError.isLeft()).toBeTruthy();
  });
});
