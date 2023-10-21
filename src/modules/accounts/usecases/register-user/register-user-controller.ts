import { HttpResponse  } from "../../../forecast/usecases/ports/http/http-response";
import { UseCase  } from "../../../forecast/usecases/ports/use-case";
import { ControllerError } from "../../../forecast/usecases/errors/controller-error"
import { badRequest, created, serverError } from "../../../forecast/usecases/helper/http-helper";
import { HttpRequest } from "../../../forecast/usecases/ports/http/http-request"
import { RegisterUserResponse } from "../../dtos/register-user-response";
import { RegisterUserRequest } from "../../dtos/register-user";
import { MissingParamError } from "@src/modules/forecast/usecases/errors/missing-param-error";

export class RegisterUserController {
  private readonly usecase: UseCase;

  constructor(usecase: UseCase) {
    this.usecase = usecase;
  }

  async handle(
    request:HttpRequest<RegisterUserRequest>
  ): Promise<HttpResponse<RegisterUserResponse | ControllerError>> {
    try {
      const { body } = request;

      if (!body?.name || !body?.email || !body?.password) {
        const missing = !body?.name ? 'name' : !body?.email ? 'email' : 'password';

        return badRequest<ControllerError>(
          new MissingParamError(missing.trim())
        );
      } 

      const response = await this.usecase.execute(request.body);

      return created<RegisterUserResponse>(response);
    } catch (error) {
      return serverError<ControllerError>(error);
    }
  }
}
