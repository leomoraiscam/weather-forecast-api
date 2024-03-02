import { IUseCase } from '@src/main/adapters/ports/use-case';
import { IRegisterUserDTO } from '@src/modules/accounts/dtos/register-user';
import { RegisterUserResponse } from '@src/modules/accounts/usecases/register-user/register-user-response';

import { AccountAlreadyExistsError } from '../../src/modules/accounts/usecases/register-user/errors/account-already-exists-error';
import { left } from '../../src/shared/logic/either';

export class ErrorThrowingConflictUseCaseStub
  implements IUseCase<IRegisterUserDTO, RegisterUserResponse>
{
  async execute(_: IRegisterUserDTO): Promise<RegisterUserResponse> {
    const error = new AccountAlreadyExistsError('any_email@email.com');

    return left(error);
  }
}
