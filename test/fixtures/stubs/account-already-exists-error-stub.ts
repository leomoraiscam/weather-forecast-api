import { RegisterUserInput } from '@src/application/usecases/users/dtos/register-user-input';
import { AccountAlreadyExistsError } from '@src/application/usecases/users/errors/account-already-exists-error';
import {
  IRegisterUser,
  RegisterUserResponse,
} from '@src/application/usecases/users/register-user/contracts/register-user-interface';
import { left } from '@src/shared/core/either';

export class ErrorThrowingConflictUseCaseStub implements IRegisterUser {
  async execute(_: RegisterUserInput): Promise<RegisterUserResponse> {
    const error = new AccountAlreadyExistsError();

    return left(error);
  }
}
