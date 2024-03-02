import { Either, left } from '@src/shared/logic/either';

import { BeachAlreadyExistsError } from '../../src/modules/forecast/usecases/register-beach/errors/beach-already-exists-error';

export class ErrorThrowingConflictUseCaseStub {
  async execute(_: any): Promise<Either<any, any>> {
    const error = new BeachAlreadyExistsError('any_email@email.com');

    return left(error);
  }
}
