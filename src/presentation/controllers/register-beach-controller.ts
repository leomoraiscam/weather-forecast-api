import { RegisterBeachInput } from '@src/application/usecases/beaches/dtos/register-beach-input';
import { BeachAlreadyExistsError } from '@src/application/usecases/beaches/errors/beach-already-exists-error';
import { UserNotFoundError } from '@src/application/usecases/beaches/errors/user-not-found-error';
import { IRegisterBeachUseCase } from '@src/application/usecases/beaches/register-beach/contracts/register-beach-interface';

import { IController } from '../contracts/controller';
import { IHttpRequest } from '../contracts/http-request';
import { IHttpResponse } from '../contracts/http-response';
import { badRequest, conflict, created, serverError, notFound } from '../helpers/http-helper';

export class RegisterBeachController implements IController {
  constructor(private readonly registerBeachUseCase: IRegisterBeachUseCase) {}

  async handle(request: IHttpRequest<RegisterBeachInput>): Promise<IHttpResponse> {
    try {
      const { body: registerBeachRequest, userId } = request;
      const response = await this.registerBeachUseCase.execute({
        ...registerBeachRequest,
        userId,
      });

      if (response.isLeft()) {
        const error = response.value;

        switch (error.constructor) {
          case BeachAlreadyExistsError:
            return conflict(error);
          case UserNotFoundError:
            return notFound(error);
          default:
            return badRequest(error);
        }
      }

      return created(response.value as RegisterBeachInput);
    } catch (error) {
      return serverError(error);
    }
  }
}
