/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { BeachPosition } from '@config/constants/beach-position-enum';
import { TypesLogger } from '@config/constants/types-logger-enum';
import { ILoggerService } from '@src/external/logger-service/ports/logger-service';
import { IFetchPointNormalize } from '@src/external/stormglass-service/dtos/fetch-point-normalize';
import { IUseCase } from '@src/main/adapters/ports/use-case';
import { IUserRepository } from '@src/modules/accounts/repositories/user-repository';
import { StormGlassResponseError } from '@src/modules/forecast/usecases/process-forecast-for-beaches/errors/stormglass-response-error';
import { Either, left, right } from '@src/shared/logic/either';

import { IBeachRatingForecast } from '../../dtos/beach-rating-forecast';
import { ITimeBeachRatingForecastDTO } from '../../dtos/time-beach-rating-forecast';
import { calculateRatingByPoint } from '../../helpers/calculate-rating-by-point';
import { normalizeForecastByTime } from '../../helpers/normalize-forecast-by-time';
import { IBeachRepository } from '../../repositories/beaches-repository';
import { BeachesNotFoundError } from './errors/beaches-not-found-error';
import { UserNotFoundError } from './errors/user-not-found-error';

export class ProcessForecastBeachesUseCase {
  constructor(
    private stormGlassService: IUseCase,
    private userRepository: IUserRepository,
    private beachRepository: IBeachRepository,
    private loggerService: ILoggerService,
  ) {}

  public async execute(
    userId: string,
  ): Promise<Either<StormGlassResponseError, ITimeBeachRatingForecastDTO[]>> {
    const userExisted = await this.userRepository.findById(userId);

    if (!userExisted) {
      return left(new UserNotFoundError());
    }

    const beaches = await this.beachRepository.findAllBeachesByUser(userId);

    if (!beaches.length) {
      return left(new BeachesNotFoundError());
    }

    const beachRatingForecastsSources: IBeachRatingForecast[] = [];

    this.loggerService.log({
      level: TypesLogger.INFO,
      message: `${ProcessForecastBeachesUseCase.name} preparing the forecast for ${beaches.length} beaches`,
    });

    for (const beach of beaches) {
      const { lat, lng, name, position } = beach;

      this.loggerService.log({
        level: TypesLogger.INFO,
        message: `${ProcessForecastBeachesUseCase.name} Preparing the ${name.value} with lat: ${lat.value} and lng: ${lng.value} to user ${userExisted.id}`,
      });

      const points = await this.stormGlassService.execute({
        lat: lat.value,
        lng: lng.value,
        userId: userExisted.id,
      });

      if (!points.value.length) {
        return left(points.value);
      }

      const enrichedBeachRating = points.value.map(
        (pointForecast: IFetchPointNormalize): IBeachRatingForecast => ({
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

      beachRatingForecastsSources.push(...enrichedBeachRating);
    }

    const normalizeForecast = normalizeForecastByTime(beachRatingForecastsSources);

    this.loggerService.log({
      level: TypesLogger.INFO,
      message: `${ProcessForecastBeachesUseCase.name} all forecast normalized data obtained with success`,
    });

    return right(normalizeForecast);
  }
}
