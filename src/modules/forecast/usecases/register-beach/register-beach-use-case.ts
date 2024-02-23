import { IUseCase } from '@src/main/adapters/ports/use-case';
import { IUserRepository } from '@src/modules/accounts/repositories/user-repository';
import { Beach } from '@src/modules/forecast/domain/beach/beach';
import { Latitude } from '@src/modules/forecast/domain/beach/latitude';
import { Longitude } from '@src/modules/forecast/domain/beach/longitude';
import { Name } from '@src/modules/forecast/domain/beach/name';
import { Position } from '@src/modules/forecast/domain/beach/position';
import { IRegisterBeachDTO } from '@src/modules/forecast/dtos/register-beach';
import { IBeachRepository } from '@src/modules/forecast/repositories/beach-repository';
import { left, right } from '@src/shared/logic/either';

import { UserNotFoundError } from '../user-beach-forecast-processing/errors/user-not-found-error';
import { BeachAlreadyExistsError } from './errors/beach-already-exists-error';
import { RegisterBeachResponse } from './register-beach-response';

export class RegisterBeachUseCase implements IUseCase<IRegisterBeachDTO, RegisterBeachResponse> {
  constructor(private beachRepository: IBeachRepository, private userRepository: IUserRepository) {}

  async execute({
    name,
    lat,
    lng,
    position,
    userId,
  }: IRegisterBeachDTO): Promise<RegisterBeachResponse> {
    const userExisted = await this.userRepository.findById(userId);

    if (!userExisted) {
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

    const beachExisted = await this.beachRepository.findByGeolocation({
      lat: beach.lat.value,
      lng: beach.lng.value,
      userId,
    });

    if (beachExisted) {
      return left(new BeachAlreadyExistsError(`lat: ${beach.lat.value} lng: ${beach.lng.value}`));
    }

    await this.beachRepository.create(beach);

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
