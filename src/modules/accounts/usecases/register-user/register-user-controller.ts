import { IUseCase } from '@src/main/adapters/ports/use-case';
import { IValidator } from '@src/main/adapters/ports/validator';
import { IControllerError } from '@src/shared/errors/ports/controller-error';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { IHttpResponse } from '@src/shared/http/dtos/http-response';
import { badRequest, conflict, created, serverError } from '@src/shared/http/helpers/http-helper';

import { IRegisterUserDTO } from '../../dtos/register-user';
import { IRegisteredUserDTO } from '../../dtos/registered-user';
import { AccountAlreadyExistsError } from './errors/account-already-exists-error';

export class RegisterUserController {
  private readonly usecase: IUseCase;
  private readonly validator: IValidator<IRegisterUserDTO>;

  readonly requiredParams = ['name', 'email', 'password'];

  constructor(usecase: IUseCase, validator: IValidator<IRegisterUserDTO>) {
    this.usecase = usecase;
    this.validator = validator;
  }

  async handle(
    request: IHttpRequest<IRegisterUserDTO>,
  ): Promise<IHttpResponse<IRegisteredUserDTO | IControllerError>> {
    const validator = this.validator.validate(request.body, this.requiredParams);

    if (validator.isLeft()) {
      return badRequest(validator.value);
    }

    try {
      const response = await this.usecase.execute(request.body);

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
