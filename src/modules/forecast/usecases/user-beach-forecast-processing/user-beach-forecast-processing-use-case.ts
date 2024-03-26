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

import { IFindTimeBeachRatingForecastDTO } from '../../dtos/find-time-beaches-rating-forecast';
import { BeachesNotFoundError } from './errors/beaches-not-found-error';
import { UserNotFoundError } from './errors/user-not-found-error';
import { UserBeachForecastProcessingResponse } from './user-beach-forecast-processing-response';

export class UserBeachForecastProcessingUseCase
  implements IUseCase<IFindTimeBeachRatingForecastDTO, UserBeachForecastProcessingResponse>
{
  constructor(
    private stormGlassService: IUseCase<IFetchPointCoordinate, FetchPointServiceResponse>,
    private userRepository: IUserRepository,
    private beachRepository: IBeachRepository,
    private loggerService: ILoggerService,
  ) {}

  public async execute({
    page,
    pageSize,
    userId,
  }: IFindTimeBeachRatingForecastDTO): Promise<UserBeachForecastProcessingResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    const beaches = await this.beachRepository.findAllBeachesByUser(userId);

    if (!beaches.length) {
      return left(new BeachesNotFoundError());
    }

    this.loggerService.log({
      level: TypesLogger.INFO,
      message: `${UserBeachForecastProcessingUseCase.name} preparing the forecast for ${beaches.length} beaches`,
    });

    const beachRatingForecastsSources: IBeachRatingForecastDTO[] = [];

    for (const beach of beaches) {
      const beachProperties = {
        lat: beach.lat.value,
        lng: beach.lng.value,
        name: beach.name.value,
        position: BeachPosition[beach.position.value as unknown as BeachPosition],
      };

      this.loggerService.log({
        level: TypesLogger.INFO,
        message: `${UserBeachForecastProcessingUseCase.name} Preparing the ${beachProperties.name} with lat: ${beachProperties.lat} and lng: ${beachProperties.lng} to user ${userId}`,
      });

      const points = await this.stormGlassService.execute({
        lat: beachProperties.lat,
        lng: beachProperties.lng,
        userId,
        page,
        pageSize,
      });

      if (points.isLeft()) {
        return left(points.value);
      }

      const enrichedBeachRating = points.value.map(
        (pointForecast: IFetchPointNormalize): IBeachRatingForecastDTO => {
          const rating = calculateRatingByPoint({
            point: pointForecast,
            beach: beachProperties,
          });

          return {
            ...beachProperties,
            ...pointForecast,
            rating,
          };
        },
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
