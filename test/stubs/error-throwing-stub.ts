import { IUseCase } from '@src/main/adapters/ports/use-case';

export class ErrorThrowingUseCaseStub<T, R> implements IUseCase<T, R> {
  async execute({}: T): Promise<R> {
    throw Error();
  }
}
