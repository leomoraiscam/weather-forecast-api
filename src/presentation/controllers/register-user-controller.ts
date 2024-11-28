import { RegisterUserInput } from '@src/application/usecases/users/register-user/dtos/register-user-input';
import { AccountAlreadyExistsError } from '@src/application/usecases/users/register-user/errors/account-already-exists-error';
import { IRegisterUserInterface } from '@src/application/usecases/users/register-user/interfaces/register-user-interface';
import { IControllerOperation } from '@src/presentation/controllers/interfaces/controller-operation';

import { IHttpRequest } from '../interfaces/http-request';
import { IHttpResponse } from '../interfaces/http-response';
import { conflict, badRequest, created, serverError } from './helpers/http-helper';

export class RegisterUserController implements IControllerOperation {
  public readonly requiredParams: string[] = ['name', 'email', 'password'];
  public constructor(private readonly registerUserUseCase: IRegisterUserInterface) {}

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
