import { IUseCase } from '@src/main/adapters/ports/use-case';
import { IValidator } from '@src/main/adapters/ports/validator';
import { IRegisterBeachDTO } from '@src/modules/forecast/dtos/register-beach';
import { IRegisteredBeachDTO } from '@src/modules/forecast/dtos/registered-beach';
import { IControllerError } from '@src/shared/errors/ports/controller-error';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { IHttpResponse } from '@src/shared/http/dtos/http-response';
import {
  badRequest,
  conflict,
  created,
  serverError,
  notFound,
} from '@src/shared/http/helpers/http-helper';

import { UserNotFoundError } from '../user-beach-forecast-processing/errors/user-not-found-error';
import { BeachAlreadyExistsError } from './errors/beach-already-exists-error';
import { RegisterBeachResponse } from './register-beach-response';

export class RegisterBeachController {
  private readonly usecase: IUseCase<IRegisterBeachDTO, RegisterBeachResponse>;
  private readonly validator: IValidator<IRegisterBeachDTO>;
  readonly requiredParams = ['name', 'lat', 'lng', 'position'];

  constructor(
    usecase: IUseCase<IRegisterBeachDTO, RegisterBeachResponse>,
    validator: IValidator<IRegisterBeachDTO>,
  ) {
    this.usecase = usecase;
    this.validator = validator;
  }

  async handle(
    request: IHttpRequest<IRegisterBeachDTO>,
  ): Promise<IHttpResponse<IRegisteredBeachDTO | IControllerError>> {
    try {
      const { body, userId } = request;

      const validator = this.validator.validate(body, this.requiredParams);

      if (validator.isLeft()) {
        return badRequest(validator.value);
      }

      const response = await this.usecase.execute({
        ...body,
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

      return created<IRegisteredBeachDTO>(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}
