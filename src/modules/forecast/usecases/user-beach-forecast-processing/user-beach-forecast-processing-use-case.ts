/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { BeachPosition } from '@config/constants/beach-position-enum';
import { TypesLogger } from '@config/constants/types-logger-enum';
import { ILoggerService } from '@src/external/logger-service/ports/logger-service';
import { IFetchPointCoordinate } from '@src/external/stormglass-service/dtos/fetch-point-coordinate';
import { IFetchPointNormalize } from '@src/external/stormglass-service/dtos/fetch-point-normalize';
import { FetchPointServiceResponse } from '@src/external/stormglass-service/services/fetch-point-service-response';
import { IUseCase } from '@src/main/adapters/ports/use-case';
import { IUserRepository } from '@src/modules/accounts/repositories/ports/user-repository';
import { IBeachRatingForecastDTO } from '@src/modules/forecast/dtos/beach-rating-forecast';
import { calculateRatingByPoint } from '@src/modules/forecast/helpers/calculate-rating-by-point';
import { normalizeForecastByTime } from '@src/modules/forecast/helpers/normalize-forecast-by-time';
import { IBeachRepository } from '@src/modules/forecast/repositories/ports/beach-repository';
import { left, right } from '@src/shared/logic/either';

import { BeachesNotFoundError } from './errors/beaches-not-found-error';
import { UserNotFoundError } from './errors/user-not-found-error';
import { UserBeachForecastProcessingResponse } from './user-beach-forecast-processing-response';

export class UserBeachForecastProcessingUseCase
  implements IUseCase<string, UserBeachForecastProcessingResponse>
{
  constructor(
    private stormGlassService: IUseCase<IFetchPointCoordinate, FetchPointServiceResponse>,
    private userRepository: IUserRepository,
    private beachRepository: IBeachRepository,
    private loggerService: ILoggerService,
  ) {}

  public async execute(userId: string): Promise<UserBeachForecastProcessingResponse> {
    const userExisted = await this.userRepository.findById(userId);

    if (!userExisted) {
      return left(new UserNotFoundError());
    }

    const beaches = await this.beachRepository.findAllBeachesByUser(userId);

    if (!beaches.length) {
      return left(new BeachesNotFoundError());
    }

    const beachRatingForecastsSources: IBeachRatingForecastDTO[] = [];

    this.loggerService.log({
      level: TypesLogger.INFO,
      message: `${UserBeachForecastProcessingUseCase.name} preparing the forecast for ${beaches.length} beaches`,
    });

    for (const beach of beaches) {
      const { lat, lng, name, position } = beach;

      this.loggerService.log({
        level: TypesLogger.INFO,
        message: `${UserBeachForecastProcessingUseCase.name} Preparing the ${name.value} with lat: ${lat.value} and lng: ${lng.value} to user ${userExisted.id}`,
      });

      const points = await this.stormGlassService.execute({
        lat: lat.value,
        lng: lng.value,
        userId: userExisted.id,
      });

      if (points.isLeft()) {
        return left(points.value);
      }

      const enrichedBeachRating = points.value.map(
        (pointForecast: IFetchPointNormalize): IBeachRatingForecastDTO => ({
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
      message: `${UserBeachForecastProcessingUseCase.name} all forecast normalized data obtained with success`,
    });

    return right(normalizeForecast);
  }
}
