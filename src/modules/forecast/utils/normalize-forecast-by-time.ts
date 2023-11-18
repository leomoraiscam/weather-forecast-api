import { ForecastRatingBeach } from '../dtos/forecast-rating-beach';
import { TimeForecast } from '../dtos/time-forecast';

export function normalizeForecastByTime(forecast: ForecastRatingBeach[]): TimeForecast[] {
  const forecastByTime: TimeForecast[] = [];

  for (const point of forecast) {
    const timePoint = forecastByTime.find((forecastData) => forecastData.time === point.time);

    if (timePoint) {
      timePoint.forecast.push(point);
    } else {
      forecastByTime.push({
        time: point.time,
        forecast: [point],
      });
    }
  }

  return forecastByTime;
}
