/* eslint-disable no-useless-constructor */
import { Either, left, right } from '@src/shared/logic/Either';

import { Beach } from '../../domain/beach/beach';
import { InvalidLatitudeError } from '../../domain/beach/errors/invalid-latitude-error';
import { InvalidLongitudeError } from '../../domain/beach/errors/invalid-longitude-error';
import { InvalidNameError } from '../../domain/beach/errors/invalid-name-error';
import { InvalidPositionError } from '../../domain/beach/errors/invalid-position-error';
import { Latitude } from '../../domain/beach/latitude';
import { Longitude } from '../../domain/beach/longitude';
import { Name } from '../../domain/beach/name';
import { Position } from '../../domain/beach/position';
import { IBeach as RegisterBeachRequest } from '../../dtos/beach';
import { IRegisterBeachResponse } from '../../dtos/register-beach-response';
import { IBeachRepository } from '../../repositories/beaches-repository';
import { BeachAlreadyExistsError } from './errors/beach-already-exists-error';

export class RegisterBeachUseCase {
  constructor(private beachesRepository: IBeachRepository) {}

  async execute({
    name,
    lat,
    lng,
    position,
    userId,
  }: RegisterBeachRequest): Promise<
    Either<
      | InvalidNameError
      | InvalidLatitudeError
      | InvalidLongitudeError
      | InvalidPositionError
      | BeachAlreadyExistsError,
      IRegisterBeachResponse
    >
  > {
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

    const BeachAlreadyExists = await this.beachesRepository.findByGeolocation({
      lat: beach.lat.value,
      lng: beach.lng.value,
    });

    if (BeachAlreadyExists) {
      return left(new BeachAlreadyExistsError(`lat: ${beach.lat.value} lng: ${beach.lng.value}`));
    }

    await this.beachesRepository.create(beach);

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
