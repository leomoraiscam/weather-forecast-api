import { IUseCase } from '@src/main/adapters/ports/use-case';
import { IRegisterBeachDTO } from '@src/modules/forecast/dtos/register-beach';
import { BeachAlreadyExistsError } from '@src/modules/forecast/usecases/register-beach/errors/beach-already-exists-error';
import { RegisterBeachResponse } from '@src/modules/forecast/usecases/register-beach/register-beach-response';
import { left } from '@src/shared/logic/either';

export class ErrorThrowingConflictUseCaseStub
  implements IUseCase<IRegisterBeachDTO, RegisterBeachResponse>
{
  async execute(_: IRegisterBeachDTO): Promise<RegisterBeachResponse> {
    const error = new BeachAlreadyExistsError('any name');

    return left(error);
  }
}
