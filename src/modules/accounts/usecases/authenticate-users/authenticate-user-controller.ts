import { HttpResponse } from "@src/shared/http/dtos/http-response"
import { UseCase  } from "@src/shared/http/ports/use-case";
import { ControllerError } from "@src/shared/errors/ports/controller-error"
import { badRequest, created, serverError } from "@src/shared/http/helpers/http-helper";
import { HttpRequest } from "@src/shared/http/dtos/http-request"
import { UserAuthenticate } from "../../dtos/authenticate-user";
import { UserToken } from "../../dtos/user-token";

export class AuthenticateUserController {
  private readonly usecase: UseCase;

  constructor(usecase: UseCase) {
    this.usecase = usecase;
  }

  async handle(
    request:HttpRequest<UserAuthenticate>
  ): Promise<HttpResponse<UserToken | ControllerError>> {
    try {
      const { body } = request;

      if (!body?.email || !body?.password) {
        const missing = !body?.email ? 'email' : 'password';

        return badRequest({
          name: 'MissingError',
          message: `Missing parameter from request: ${missing}.`
        })
      } 

      const response = await this.usecase.execute(request.body);

      return created<UserToken>(response);
    } catch (error) {
      return serverError(error);
    }
  }
}
