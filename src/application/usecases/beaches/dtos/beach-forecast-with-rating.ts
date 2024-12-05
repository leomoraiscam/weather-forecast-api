import { BeachForecastPointDetails } from './beach-forecast-point-details';
import { RegisterBeachInput } from './register-beach-input';

export interface BeachForecastWithRating
  extends Omit<RegisterBeachInput, 'userId'>,
    BeachForecastPointDetails {
  rating: number;
}
