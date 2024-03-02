import { AccountAlreadyExistsError } from '../../src/modules/accounts/usecases/register-user/errors/account-already-exists-error';
import { Either, left } from '../../src/shared/logic/either';

export class ErrorThrowingConflictUseCaseStub {
  async execute(_: any): Promise<Either<any, any>> {
    const error = new AccountAlreadyExistsError('any_email@email.com');

    return left(error);
  }
}
