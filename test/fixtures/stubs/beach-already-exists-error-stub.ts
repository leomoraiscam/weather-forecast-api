import { RegisterBeachInput } from '@src/application/usecases/beaches/dtos/register-beach-input';
import { BeachAlreadyExistsError } from '@src/application/usecases/beaches/errors/beach-already-exists-error';
import {
  IRegisterBeachUseCase,
  RegisterBeachResponse,
} from '@src/application/usecases/beaches/register-beach/contracts/register-beach-interface';
import { left } from '@src/shared/core/either';

export class ErrorThrowingConflictUseCaseStub implements IRegisterBeachUseCase {
  async execute(_: RegisterBeachInput): Promise<RegisterBeachResponse> {
    const error = new BeachAlreadyExistsError('any name');

    return left(error);
  }
}
