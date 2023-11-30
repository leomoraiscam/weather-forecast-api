import { WAVE_HEIGHTS } from '@src/config/constants/waves-height';

export function getRatingForSwellSize(height: number): number {
  if (height < WAVE_HEIGHTS.ankleToKnee.min) return 1;

  if (height < WAVE_HEIGHTS.ankleToKnee.max) return 2;

  if (height < WAVE_HEIGHTS.waistHigh.max) return 3;

  return 5;
}
