import { IUseCase } from '@src/main/adapters/ports/use-case';
import { IValidator } from '@src/main/adapters/ports/validator';
import { IControllerError } from '@src/shared/errors/ports/controller-error';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { IHttpResponse } from '@src/shared/http/dtos/http-response';
import { badRequest, ok, serverError, unauthorized } from '@src/shared/http/helpers/http-helper';

import { IAuthenticateUserDTO } from '../../dtos/authenticate-user';
import { IAuthenticationUserDTO } from '../../dtos/authentication-user';
import { InvalidEmailOrPasswordError } from './errors/invalid-email-or-password-error';

export class AuthenticateUserController {
  private readonly usecase: IUseCase;
  private readonly validator: IValidator<IAuthenticateUserDTO>;
  readonly requiredParams = ['email', 'password'];

  constructor(usecase: IUseCase, validator: IValidator<IAuthenticateUserDTO>) {
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
            return unauthorized(error);
        }
      }

      return ok<IAuthenticationUserDTO>(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}
