import { HttpResponse } from "@src/shared/http/dtos/http-response"
import { UseCase  } from "@src/shared/http/ports/use-case";
import { ControllerError } from "@src/shared/errors/ports/controller-error"
import { badRequest, created, serverError } from "@src/shared/http/helpers/http-helper";
import { HttpRequest } from "@src/shared/http/dtos/http-request"
import { RegisterUserResponse } from "../../dtos/register-user-response";
import { RegisterUserRequest } from "../../dtos/register-user";
import { MissingParamError } from "@src/shared/errors/exceptions/missing-param-error";

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
