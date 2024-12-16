import { TypesLogger } from '@src/application/contracts/providers/logger-provider/enums/types-logger-enum';
import { ILoggerProvider } from '@src/application/contracts/providers/logger-provider/logger-provider';
import { IBeachRepository } from '@src/application/contracts/repositories/beaches/beach-repository';
import { IUserRepository } from '@src/application/contracts/repositories/users/user-repository';
import { IStormGlassService } from '@src/application/contracts/services/stormglass/stormglass-service-interface';
import { left, right } from '@src/shared/core/either';
import { BeachPosition } from '@src/shared/enums/beach-position-enum';

import { BeachForecastPointDetails } from '../dtos/beach-forecast-point-details';
import { BeachForecastWithRating } from '../dtos/beach-forecast-with-rating';
import { IGetBeachForecastInput } from '../dtos/get-beach-forecast-input';
import { BeachNotFoundError } from '../errors/beach-not-found-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import {
  IGetUserBeachesForecastUseCase,
  GetUserBeachesForecastResponse,
} from './contracts/get-user-beaches-interface';
import { calculateBeachForecastOverallRating } from './helpers/calculate-beach-forecast-overall-rating';
import { groupForecastByTime } from './helpers/group-forecast-by-time';

export class GetUserBeachesForecastUseCase implements IGetUserBeachesForecastUseCase {
  constructor(
    private stormGlassService: IStormGlassService,
    private userRepository: IUserRepository,
    private beachRepository: IBeachRepository,
    private loggerProvider: ILoggerProvider,
  ) {}

  public async execute(input: IGetBeachForecastInput): Promise<GetUserBeachesForecastResponse> {
    const { userId, page, pageSize } = input;
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    const beaches = await this.beachRepository.findAllBeachesByUser(userId);

    if (!beaches.length) {
      return left(new BeachNotFoundError());
    }

    this.loggerProvider.log({
      level: TypesLogger.INFO,
      message: `${GetUserBeachesForecastUseCase.name} preparing the forecast for ${beaches.length} beaches`,
    });

    const beachesForecastWithRating: BeachForecastWithRating[] = [];
    for (const beach of beaches) {
      const userBeach = {
        lat: beach.lat.value,
        lng: beach.lng.value,
        name: beach.name.value,
        position: BeachPosition[beach.position.value as unknown as BeachPosition],
      };

      this.loggerProvider.log({
        level: TypesLogger.INFO,
        message: `${GetUserBeachesForecastUseCase.name} Preparing the ${userBeach.name} with lat: ${userBeach.lat} and lng: ${userBeach.lng} to user ${userId}`,
      });

      const forecastWeatherPointResponse = await this.stormGlassService.execute({
        lat: userBeach.lat,
        lng: userBeach.lng,
        page,
        pageSize,
        userId,
      });

      const beachForecastWithRating = forecastWeatherPointResponse.map(
        (weatherPointForecast: BeachForecastPointDetails): BeachForecastWithRating => {
          const rating = calculateBeachForecastOverallRating(weatherPointForecast, userBeach);

          return {
            ...userBeach,
            ...weatherPointForecast,
            rating,
          };
        },
      );

      beachesForecastWithRating.push(...beachForecastWithRating);
    }

    const beachForecastPointDetailsGrouped = groupForecastByTime(beachesForecastWithRating);

    this.loggerProvider.log({
      level: TypesLogger.INFO,
      message: `${GetUserBeachesForecastUseCase.name} all forecast normalized data obtained with success`,
    });

    return right(beachForecastPointDetailsGrouped);
  }
}
