import { AuthenticateUserInput } from '@src/application/usecases/users/authenticate-user/dtos/authenticate-user-input';
import { AuthenticateUserOutput } from '@src/application/usecases/users/authenticate-user/dtos/authenticate-user-output';
import { InvalidEmailOrPasswordError } from '@src/application/usecases/users/authenticate-user/errors/invalid-email-or-password-error';
import { IAuthenticateUserInterface } from '@src/application/usecases/users/authenticate-user/interfaces/authenticate-user-interface';

import { IHttpRequest } from '../interfaces/http-request';
import { IHttpResponse } from '../interfaces/http-response';
import { badRequest, ok, serverError, unauthorized } from './helpers/http-helper';

export class AuthenticateUserController {
  public readonly requiredParams = ['email', 'password'];
  public constructor(private readonly authenticateUserUseCase: IAuthenticateUserInterface) {}

  async handle(request: IHttpRequest<AuthenticateUserInput>): Promise<IHttpResponse> {
    const { body: authenticateUserRequest } = request;

    try {
      const response = await this.authenticateUserUseCase.execute(authenticateUserRequest);

      if (response.isLeft()) {
        const error = response.value;

        switch (error.constructor) {
          case InvalidEmailOrPasswordError:
            return unauthorized(error);
          default:
            return badRequest(error);
        }
      }

      return ok<AuthenticateUserOutput>(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}
