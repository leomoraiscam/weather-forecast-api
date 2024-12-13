import { IUseCase } from '@src/main/adapters/ports/use-case';
import { left } from '@src/shared/core/either';

export class ErrorDefaultThrowingUseCaseStub<T, R> implements IUseCase<T, R> {
  async execute({}: T): Promise<R> {
    const error = new Error('Unexpected error occurred');

    return left(error) as unknown as R;
  }
}
