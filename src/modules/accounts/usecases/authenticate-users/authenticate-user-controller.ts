import { HttpResponse  } from "../../../forecast/usecases/ports/http/http-response";
import { UseCase  } from "../../../forecast/usecases/ports/use-case";
import { ControllerError } from "../../../forecast/usecases/errors/controller-error"
import { badRequest, created, serverError } from "../../../forecast/usecases/helper/http-helper";
import { HttpRequest } from "../../../forecast/usecases/ports/http/http-request"
import { UserAuthenticate } from "../../dtos/authenticate-user";
import { MissingParamError } from "@src/modules/forecast/usecases/errors/missing-param-error";
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

        return badRequest<ControllerError>(
          new MissingParamError(missing.trim())
        );
      } 

      const response = await this.usecase.execute(request.body);

      return created<UserToken>(response);
    } catch (error) {
      return serverError<ControllerError>(error);
    }
  }
}
