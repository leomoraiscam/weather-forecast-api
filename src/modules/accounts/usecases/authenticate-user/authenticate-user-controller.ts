import { UseCase } from '@src/main/adapters/ports/use-case';
import { IControllerError } from '@src/shared/errors/ports/controller-error';
import { HttpRequest } from '@src/shared/http/dtos/http-request';
import { HttpResponse } from '@src/shared/http/dtos/http-response';
import { badRequest, created, serverError } from '@src/shared/http/helpers/http-helper';

import { IAuthenticateUserRequest } from '../../dtos/authenticate-user-request';
import { IAuthenticateUserResponse } from '../../dtos/authenticate-user-response';

export class AuthenticateUserController {
  private readonly usecase: UseCase;

  constructor(usecase: UseCase) {
    this.usecase = usecase;
  }

  async handle(
    request: HttpRequest<IAuthenticateUserRequest>,
  ): Promise<HttpResponse<IAuthenticateUserResponse | IControllerError>> {
    try {
      const { body } = request;

      if (!body?.email || !body?.password) {
        const missing = !body?.email ? 'email' : 'password';

        return badRequest({
          name: 'MissingError',
          message: `Missing parameter from request: ${missing}.`,
        });
      }

      const response = await this.usecase.execute(body);

      return created<IAuthenticateUserResponse>(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}
