import { BeachForecastWithRating } from '../dtos/beach-forecast-with-rating';
import { TimeGroupedBeachForecast } from '../dtos/timed-grouped-beach-forecast';

export function groupForecastByTime(
  forecast: BeachForecastWithRating[],
): TimeGroupedBeachForecast[] {
  const forecastByTime: { [time: string]: TimeGroupedBeachForecast } = {};

  for (const point of forecast) {
    if (!forecastByTime[point.time]) {
      forecastByTime[point.time] = { time: point.time, forecast: [] };
    }

    forecastByTime[point.time].forecast.push(point);
  }

  return Object.values(forecastByTime);
}
