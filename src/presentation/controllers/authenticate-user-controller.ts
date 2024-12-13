import { IAuthenticateUser } from '@src/application/usecases/users/authenticate-user/contracts/authenticate-user-interface';
import { AuthenticateUserInput } from '@src/application/usecases/users/dtos/authenticate-user-input';
import { AuthenticateUserOutput } from '@src/application/usecases/users/dtos/authenticate-user-output';
import { InvalidEmailOrPasswordError } from '@src/application/usecases/users/errors/invalid-email-or-password-error';

import { IHttpRequest } from '../contracts/http-request';
import { IHttpResponse } from '../contracts/http-response';
import { badRequest, ok, serverError, unauthorized } from '../helpers/http-helper';

export class AuthenticateUserController {
  public readonly requiredParams = ['email', 'password'];
  public constructor(private readonly authenticateUserUseCase: IAuthenticateUser) {}

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
