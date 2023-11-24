import { UseCase } from '@src/main/adapters/ports/use-case';
import { ControllerError } from '@src/shared/errors/ports/controller-error';
import { HttpRequest } from '@src/shared/http/dtos/http-request';
import { HttpResponse } from '@src/shared/http/dtos/http-response';
import { badRequest, conflict, created, serverError } from '@src/shared/http/helpers/http-helper';

import { IRegisterUserRequest } from '../../dtos/register-user-request';
import { IRegisterUser } from '../../dtos/register-user-response';
import { AccountAlreadyExistsError } from './errors/account-already-exists-error';

export class RegisterUserController {
  private readonly usecase: UseCase;

  constructor(usecase: UseCase) {
    this.usecase = usecase;
  }

  async handle(
    request: HttpRequest<IRegisterUserRequest>,
  ): Promise<HttpResponse<IRegisterUser | ControllerError>> {
    try {
      const { body } = request;

      if (!body?.name || !body?.email || !body?.password) {
        const missing = !body?.name ? 'name' : !body?.email ? 'email' : 'password';

        return badRequest({
          name: 'MissingError',
          message: `Missing parameter from request: ${missing}.`,
        });
      }

      const response = await this.usecase.execute(body);

      if (response.isLeft()) {
        const error = response.value;

        switch (error.constructor) {
          case AccountAlreadyExistsError:
            return conflict(error);
          default:
            return badRequest(error);
        }
      }

      return created<IRegisterUser>(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}
