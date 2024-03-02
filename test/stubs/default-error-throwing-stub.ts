import { Either, left } from '../../src/shared/logic/either';

export class ErrorDefaultThrowingUseCaseStub {
  async execute(_: any): Promise<Either<any, any>> {
    const error = new Error('Unexpected error occurred');

    return left(error);
  }
}
