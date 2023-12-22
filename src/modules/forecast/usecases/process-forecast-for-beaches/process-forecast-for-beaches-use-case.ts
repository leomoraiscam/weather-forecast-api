/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { BeachPosition } from '@config/constants/beach-position-enum';
import { TypesLogger } from '@config/constants/types-logger-enum';
import { ILoggerService } from '@src/external/logger-service/ports/logger-service';
import { IFetchPointNormalize } from '@src/external/stormglass-service/dtos/fetch-point-normalize';
import { IUseCase } from '@src/main/adapters/ports/use-case';
import { IUsersRepository } from '@src/modules/accounts/repositories/users-repository';
import { StormGlassResponseError } from '@src/modules/forecast/usecases/process-forecast-for-beaches/errors/stormglass-response-error';
import { Either, left, right } from '@src/shared/logic/either';

import { IForecastRatingBeach } from '../../dtos/forecast-rating-beach';
import { ITimeForecast } from '../../dtos/time-forecast';
import { calculateRatingByPoint } from '../../helpers/calculate-rating-by-point';
import { normalizeForecastByTime } from '../../helpers/normalize-forecast-by-time';
import { IBeachRepository } from '../../repositories/beaches-repository';
import { BeachesNotFoundError } from './errors/beaches-not-found-error';
import { UserNotFoundError } from './errors/user-not-found-error';

export class ProcessForecastBeachesUseCase {
  constructor(
    private stormGlassService: IUseCase,
    private usersRepository: IUsersRepository,
    private beachesRepository: IBeachRepository,
    private loggerService: ILoggerService,
  ) {}

  public async execute(userId: string): Promise<Either<StormGlassResponseError, ITimeForecast[]>> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    const beaches = await this.beachesRepository.findAllBeachesByUser(userId);

    if (!beaches.length) {
      return left(new BeachesNotFoundError());
    }

    const beachForecastsSources: IForecastRatingBeach[] = [];

    this.loggerService.log({
      level: TypesLogger.INFO,
      message: `${ProcessForecastBeachesUseCase.name} preparing the forecast for ${beaches.length} beaches`,
    });

    for (const beach of beaches) {
      const { lat, lng, name, position } = beach;

      this.loggerService.log({
        level: TypesLogger.INFO,
        message: `${ProcessForecastBeachesUseCase.name} Preparing the ${name.value} with lat: ${lat.value} and lng: ${lng.value} to user ${user.id}`,
      });

      const points = await this.stormGlassService.execute({
        lat: lat.value,
        lng: lng.value,
        userId: user.id,
      });

      if (!points.value.length) {
        return left(points.value);
      }

      const enrichedBeachRating = points.value.map(
        (pointForecast: IFetchPointNormalize): IForecastRatingBeach => ({
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

    this.loggerService.log({
      level: TypesLogger.INFO,
      message: `${ProcessForecastBeachesUseCase.name} all forecast normalized data obtained with success`,
    });

    return right(normalizeForecast);
  }
}
