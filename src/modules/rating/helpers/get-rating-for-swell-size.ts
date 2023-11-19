const WAVE_HEIGHTS = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waistHigh: {
    min: 1.0,
    max: 2.0,
  },
  headHigh: {
    min: 2.0,
    max: 2.5,
  },
};

export function getRatingForSwellSize(height: number): number {
  if (height < WAVE_HEIGHTS.ankleToKnee.min) return 1;

  if (height < WAVE_HEIGHTS.ankleToKnee.max) return 2;

  if (height < WAVE_HEIGHTS.waistHigh.max) return 3;

  return 5;
}
