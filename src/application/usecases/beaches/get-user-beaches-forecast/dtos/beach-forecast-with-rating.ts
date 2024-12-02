import { RegisterBeachInput } from '../../register-beach/dtos/register-beach-input';
import { BeachForecastPointDetails } from './beach-forecast-point-details';

export interface BeachForecastWithRating
  extends Omit<RegisterBeachInput, 'userId'>,
    BeachForecastPointDetails {
  rating: number;
}
