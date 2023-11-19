import { ForecastRatingBeach } from '../../dtos/forecast-rating-beach';
import { TimeForecast } from '../../dtos/time-forecast';
import { normalizeForecastByTime } from '../../utils/normalize-forecast-by-time';
import { BeachPosition } from '@config/constants/beach-position-enum';
import { UseCase } from '@src/main/adapters/ports/use-case';
import { FetchPointNormalize } from '@src/external/stormglass-service/dtos/fetch-point-normalize';
import { Either, left, right } from '@src/shared/logic/Either';
import { StormGlassResponseError } from '@src/modules/forecast/usecases/process-forecast-for-beaches/errors/stormglass-response-error';
import { IUsersRepository } from '@src/modules/accounts/repositories/users-repository';
import { IBeachRepository } from '../../repositories/beaches-repository';
import { BeachesNotFoundError } from './errors/beaches-not-found-error';
import { UserNotFoundError } from './errors/user-not-found-error';
import { calculateRatingByPoint } from '../../helpers/calculate-rating-by-point';

export class ProcessForecastBeachesUseCase {
  constructor(
    private stormGlassService: UseCase,
    private usersRepository: IUsersRepository,
    private beachesRepository: IBeachRepository,
  ) {}

  public async execute(userId: string): Promise<Either<StormGlassResponseError, TimeForecast[]>> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    const beaches = await this.beachesRepository.findAllBeachesByUser(userId);

    if (!beaches) {
      return left(new BeachesNotFoundError());
    }

    const beachForecastsSources: ForecastRatingBeach[] = [];

    for (const beach of beaches) {
      const { lat, lng, name, position } = beach;

      const points = await this.stormGlassService.execute({ lat: lat.value, lng: lng.value }); //OK

      if (!points.value.length) {
        return left(points.value);
      }

      const enrichedBeachRating = points.value.map(
        (pointForecast: FetchPointNormalize): ForecastRatingBeach => ({
          lat: lat.value,
          lng: lng.value,
          name: name.value,
          position: BeachPosition[position.value as unknown as BeachPosition],
          rating: calculateRatingByPoint(pointForecast, {
            lat: lat.value,
            lng: lng.value,
            name: name.value,
            position: BeachPosition[position.value as unknown as BeachPosition],
          }),
          ...pointForecast,
        }),
      );

      beachForecastsSources.push(...enrichedBeachRating);
    }

    const normalizeForecast = normalizeForecastByTime(beachForecastsSources);

    return right(normalizeForecast);
  }
}
