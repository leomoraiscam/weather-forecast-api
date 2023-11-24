/* eslint-disable no-nested-ternary */
import { IUseCase } from '@src/main/adapters/ports/use-case';
import { IControllerError } from '@src/shared/errors/ports/controller-error';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { IHttpResponse } from '@src/shared/http/dtos/http-response';
import { badRequest, conflict, created, serverError } from '@src/shared/http/helpers/http-helper';

import { IRegisterUserRequest } from '../../dtos/register-user-request';
import { IRegisterUser } from '../../dtos/register-user-response';
import { AccountAlreadyExistsError } from './errors/account-already-exists-error';

export class RegisterUserController {
  private readonly usecase: IUseCase;

  constructor(usecase: IUseCase) {
    this.usecase = usecase;
  }

  async handle(
    request: IHttpRequest<IRegisterUserRequest>,
  ): Promise<IHttpResponse<IRegisterUser | IControllerError>> {
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
