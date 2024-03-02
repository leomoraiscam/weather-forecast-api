import { InvalidLatitudeError } from '@src/modules/forecast/domain/beach/errors/invalid-latitude-error';
import { InvalidLongitudeError } from '@src/modules/forecast/domain/beach/errors/invalid-longitude-error';
import { InvalidNameError } from '@src/modules/forecast/domain/beach/errors/invalid-name-error';
import { InvalidPositionError } from '@src/modules/forecast/domain/beach/errors/invalid-position-error';
import { IRegisteredBeachDTO } from '@src/modules/forecast/dtos/registered-beach';
import { Either } from '@src/shared/logic/either';

import { UserNotFoundError } from '../user-beach-forecast-processing/errors/user-not-found-error';
import { BeachAlreadyExistsError } from './errors/beach-already-exists-error';

export type RegisterBeachResponse = Either<
  | InvalidNameError
  | InvalidLatitudeError
  | InvalidLongitudeError
  | InvalidPositionError
  | BeachAlreadyExistsError
  | UserNotFoundError,
  IRegisteredBeachDTO
>;
