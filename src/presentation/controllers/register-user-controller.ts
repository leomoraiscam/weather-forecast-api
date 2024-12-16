import { RegisterUserInput } from '@src/application/usecases/users/dtos/register-user-input';
import { AccountAlreadyExistsError } from '@src/application/usecases/users/errors/account-already-exists-error';
import { IRegisterUserUseCase } from '@src/application/usecases/users/register-user/contracts/register-user-interface';

import { IController } from '../contracts/controller';
import { IHttpRequest } from '../contracts/http-request';
import { IHttpResponse } from '../contracts/http-response';
import { conflict, badRequest, created, serverError } from '../helpers/http-helper';

export class RegisterUserController implements IController {
  public constructor(private readonly registerUserUseCase: IRegisterUserUseCase) {}

  async handle(request: IHttpRequest<RegisterUserInput>): Promise<IHttpResponse> {
    const { body: registerUserRequest } = request;

    try {
      const response = await this.registerUserUseCase.execute(registerUserRequest);

      if (response.isLeft()) {
        const error = response.value;

        switch (error.constructor) {
          case AccountAlreadyExistsError:
            return conflict(error);
          default:
            return badRequest(error);
        }
      }

      return created(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}
