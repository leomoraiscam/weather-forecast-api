import { UserNotFoundError } from '@src/application/usecases/beaches/errors/user-not-found-error';
import { InvalidLatitudeError } from '@src/entities/beach/errors/invalid-latitude-error';
import { InvalidLongitudeError } from '@src/entities/beach/errors/invalid-longitude-error';
import { InvalidNameError } from '@src/entities/beach/errors/invalid-name-error';
import { InvalidPositionError } from '@src/entities/beach/errors/invalid-position-error';
import { Either } from '@src/shared/logic/either';

import { BeachAlreadyExistsError } from '../../errors/beach-already-exists-error';
import { RegisterBeachInput } from '../dtos/register-beach-input';
import { RegisterBeachOutput } from '../dtos/register-beach-output';

export type RegisterBeachResponse = Either<
  | InvalidNameError
  | InvalidLatitudeError
  | InvalidLongitudeError
  | InvalidPositionError
  | BeachAlreadyExistsError
  | UserNotFoundError,
  RegisterBeachOutput
>;

export interface IRegisterBeachInterface {
  execute: (registerBeachInput: RegisterBeachInput) => Promise<RegisterBeachResponse>;
}
