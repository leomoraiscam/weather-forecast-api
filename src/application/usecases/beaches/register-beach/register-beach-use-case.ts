import { ICacheProvider } from '@src/application/contracts/providers/cache-provider/cache-provider';
import { IBeachRepository } from '@src/application/contracts/repositories/beaches/beach-repository';
import { IUserRepository } from '@src/application/contracts/repositories/users/user-repository';
import { RegisterBeachInput } from '@src/application/usecases/beaches/dtos/register-beach-input';
import { Beach } from '@src/entities/beach/beach';
import { Latitude } from '@src/entities/beach/latitude';
import { Longitude } from '@src/entities/beach/longitude';
import { Name } from '@src/entities/beach/name';
import { Position } from '@src/entities/beach/position';
import { left, right } from '@src/shared/core/either';

import { BeachAlreadyExistsError } from '../errors/beach-already-exists-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { RegisterBeachResponse, IRegisterBeachUseCase } from './contracts/register-beach-interface';

export class RegisterBeachUseCase implements IRegisterBeachUseCase {
  constructor(
    private beachRepository: IBeachRepository,
    private userRepository: IUserRepository,
    private cacheService: ICacheProvider,
  ) {}

  async execute(input: RegisterBeachInput): Promise<RegisterBeachResponse> {
    const { name, lat, lng, position, userId } = input;
    const cacheKey = `provider-forecast-point: ${userId}`;
    const existingUser = await this.userRepository.findById(userId);

    if (!existingUser) {
      return left(new UserNotFoundError());
    }

    const nameOrError = Name.create(name);
    const latitudeOrError = Latitude.create(lat);
    const longitudeOrError = Longitude.create(lng);
    const positionOrError = Position.create(position);

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (latitudeOrError.isLeft()) {
      return left(latitudeOrError.value);
    }

    if (longitudeOrError.isLeft()) {
      return left(longitudeOrError.value);
    }

    if (positionOrError.isLeft()) {
      return left(positionOrError.value);
    }

    const beachOrError = Beach.create({
      name: nameOrError.value,
      lat: latitudeOrError.value,
      lng: longitudeOrError.value,
      position: positionOrError.value,
      userId,
    });

    if (beachOrError.isLeft()) {
      return left(beachOrError.value);
    }

    const beach = beachOrError.value;
    const existingBeach = await this.beachRepository.findByGeolocation({
      lat: beach.lat.value,
      lng: beach.lng.value,
      userId,
    });

    if (existingBeach) {
      return left(new BeachAlreadyExistsError(`lat: ${beach.lat.value} lng: ${beach.lng.value}`));
    }

    await Promise.all([
      this.beachRepository.create(beach),
      this.cacheService.invalidatePrefix(cacheKey),
    ]);

    return right({
      id: beach.id,
      name: beach.name.value,
      lat: beach.lat.value,
      lng: beach.lng.value,
      position: beach.position.value,
      userId,
    });
  }
}
