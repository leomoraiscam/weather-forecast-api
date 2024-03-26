import { IUseCase } from '@src/main/adapters/ports/use-case';
import { IValidator } from '@src/main/adapters/ports/validator';
import { IRegisterUserDTO } from '@src/modules/accounts/dtos/register-user';
import { IRegisteredUserDTO } from '@src/modules/accounts/dtos/registered-user';
import { IControllerError } from '@src/shared/errors/ports/controller-error';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { IHttpResponse } from '@src/shared/http/dtos/http-response';
import { badRequest, conflict, created, serverError } from '@src/shared/http/helpers/http-helper';

import { AccountAlreadyExistsError } from './errors/account-already-exists-error';
import { RegisterUserResponse } from './register-user-response';

export class RegisterUserController {
  private readonly usecase: IUseCase<IRegisterUserDTO, RegisterUserResponse>;
  private readonly validator: IValidator<IRegisterUserDTO>;
  private readonly requiredParams = ['name', 'email', 'password'];

  constructor(
    usecase: IUseCase<IRegisterUserDTO, RegisterUserResponse>,
    validator: IValidator<IRegisterUserDTO>,
  ) {
    this.usecase = usecase;
    this.validator = validator;
  }

  async handle(
    request: IHttpRequest<IRegisterUserDTO>,
  ): Promise<IHttpResponse<IRegisteredUserDTO | IControllerError>> {
    const { body } = request;

    const validator = this.validator.validate(body, this.requiredParams);

    if (validator.isLeft()) {
      return badRequest(validator.value);
    }

    try {
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

      return created<IRegisteredUserDTO>(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}
