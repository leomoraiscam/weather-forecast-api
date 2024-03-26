import { IUseCase } from '@src/main/adapters/ports/use-case';
import { IValidator } from '@src/main/adapters/ports/validator';
import { IAuthenticateUserDTO } from '@src/modules/accounts/dtos/authenticate-user';
import { IAuthenticationUserDTO } from '@src/modules/accounts/dtos/authentication-user';
import { IControllerError } from '@src/shared/errors/ports/controller-error';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { IHttpResponse } from '@src/shared/http/dtos/http-response';
import { badRequest, ok, serverError, unauthorized } from '@src/shared/http/helpers/http-helper';

import { AuthenticateUserResponse } from './authenticate-user-response';
import { InvalidEmailOrPasswordError } from './errors/invalid-email-or-password-error';

export class AuthenticateUserController {
  private readonly usecase: IUseCase<IAuthenticateUserDTO, AuthenticateUserResponse>;
  private readonly validator: IValidator<IAuthenticateUserDTO>;
  private readonly requiredParams = ['email', 'password'];

  constructor(
    usecase: IUseCase<IAuthenticateUserDTO, AuthenticateUserResponse>,
    validator: IValidator<IAuthenticateUserDTO>,
  ) {
    this.usecase = usecase;
    this.validator = validator;
  }

  async handle(
    request: IHttpRequest<IAuthenticateUserDTO>,
  ): Promise<IHttpResponse<IAuthenticationUserDTO | IControllerError>> {
    const validator = this.validator.validate(request.body, this.requiredParams);

    if (validator.isLeft()) {
      return badRequest(validator.value);
    }

    try {
      const response = await this.usecase.execute(request.body);

      if (response.isLeft()) {
        const error = response.value;

        switch (error.constructor) {
          case InvalidEmailOrPasswordError:
            return unauthorized(error);
          default:
            return badRequest(error);
        }
      }

      return ok<IAuthenticationUserDTO>(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}
