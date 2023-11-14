import { HttpResponse } from "@src/shared/http/dtos/http-response"
import { UseCase  } from "@src/main/adapters/ports/use-case";
import { badRequest, conflict, created, serverError } from "@src/shared/http/helpers/http-helper";
import { HttpRequest } from "@src/shared/http/dtos/http-request"
import { RegisterUser } from "../../dtos/register-user-response";
import { RegisterUserRequest } from "../../dtos/register-user-request";
import { AccountAlreadyExistsError } from "./errors/account-already-exists-error";
import { ControllerError } from "@src/shared/errors/ports/controller-error";

export class RegisterUserController {
  private readonly usecase: UseCase;

  constructor(usecase: UseCase) {
    this.usecase = usecase;
  }

  async handle(
    request:HttpRequest<RegisterUserRequest>
  ): Promise<HttpResponse<RegisterUser | ControllerError>> {
    try {
      const { body } = request;

      if (!body?.name || !body?.email || !body?.password) {
        const missing = !body?.name ? 'name' : !body?.email ? 'email' : 'password';

        return badRequest({
          name: 'MissingError',
          message: `Missing parameter from request: ${missing}.`
        })
      }

      const response = await this.usecase.execute(body);

      if (response.isLeft()) {
        const error = response.value

        switch (error.constructor) {
          case AccountAlreadyExistsError:
            return conflict(error)
          default:
            return badRequest(error)
        }
      } 
      
      return created<RegisterUser>(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}

