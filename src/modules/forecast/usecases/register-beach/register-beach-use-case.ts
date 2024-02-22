import { IUserRepository } from '@src/modules/accounts/repositories/user-repository';
import { Either, left, right } from '@src/shared/logic/either';

import { Beach } from '../../domain/beach/beach';
import { InvalidLatitudeError } from '../../domain/beach/errors/invalid-latitude-error';
import { InvalidLongitudeError } from '../../domain/beach/errors/invalid-longitude-error';
import { InvalidNameError } from '../../domain/beach/errors/invalid-name-error';
import { InvalidPositionError } from '../../domain/beach/errors/invalid-position-error';
import { Latitude } from '../../domain/beach/latitude';
import { Longitude } from '../../domain/beach/longitude';
import { Name } from '../../domain/beach/name';
import { Position } from '../../domain/beach/position';
import { IRegisterBeachDTO } from '../../dtos/register-beach';
import { IRegisteredBeachDTO } from '../../dtos/registered-beach';
import { IBeachRepository } from '../../repositories/beaches-repository';
import { UserNotFoundError } from '../process-forecast-for-beaches/errors/user-not-found-error';
import { BeachAlreadyExistsError } from './errors/beach-already-exists-error';

export class RegisterBeachUseCase {
  constructor(private beachRepository: IBeachRepository, private userRepository: IUserRepository) {}

  async execute({
    name,
    lat,
    lng,
    position,
    userId,
  }: IRegisterBeachDTO): Promise<
    Either<
      | InvalidNameError
      | InvalidLatitudeError
      | InvalidLongitudeError
      | InvalidPositionError
      | BeachAlreadyExistsError
      | UserNotFoundError,
      IRegisteredBeachDTO
    >
  > {
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
