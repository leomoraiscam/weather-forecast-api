import { BeachForecast } from "../dtos/beach-forecast";
import { TimeForecast } from "../dtos/time-forecast";

export function forecastByTime (forecast:BeachForecast[]): TimeForecast[] {
  const forecastByTime: TimeForecast[] = [];

  for(const point of forecast) {
    const timePoint = forecastByTime.find((forecastData) => forecastData.time === point.time);

    if (timePoint) {
      timePoint.forecast.push(point);
    } else {
      forecastByTime.push({
        time: point.time,
        forecast: [point]
      })
    }
  }

  return forecastByTime
}