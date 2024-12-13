import { BeachPosition } from '@src/shared/enums/beach-position-enum';

export function getPositionFromLocation(coordinates: number): BeachPosition {
  if (coordinates < 50) return BeachPosition.N;

  if (coordinates < 120) return BeachPosition.E;

  if (coordinates < 220) return BeachPosition.S;

  if (coordinates < 310) return BeachPosition.W;

  return BeachPosition.N;
}
