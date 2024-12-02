import { BeachPosition } from '@config/constants/beach-position-enum';

export function getDirectionPosition(position: number): BeachPosition {
  if (position < 50) return BeachPosition.N;

  if (position < 120) return BeachPosition.E;

  if (position < 220) return BeachPosition.S;

  if (position < 310) return BeachPosition.W;

  return BeachPosition.N;
}
