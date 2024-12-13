import { RegisterBeachInput } from '@src/application/usecases/beaches/dtos/register-beach-input';
import { BeachAlreadyExistsError } from '@src/application/usecases/beaches/errors/beach-already-exists-error';
import { UserNotFoundError } from '@src/application/usecases/beaches/errors/user-not-found-error';
import { IRegisterBeach } from '@src/application/usecases/beaches/register-beach/contracts/register-beach-interface';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';

import { IHttpResponse } from '../contracts/http-response';
import { badRequest, conflict, created, serverError, notFound } from '../helpers/http-helper';

export class RegisterBeachController {
  constructor(private readonly registerBeachUseCase: IRegisterBeach) {}

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
