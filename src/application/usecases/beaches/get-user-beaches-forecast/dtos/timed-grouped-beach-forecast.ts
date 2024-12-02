import { BeachForecastWithRating } from './beach-forecast-with-rating';

export interface TimeGroupedBeachForecast {
  time: string;
  forecast: BeachForecastWithRating[];
}
