import { HttpResponse  } from "../../../forecast/usecases/ports/http/http-response";
import { UseCase  } from "../../../forecast/usecases/ports/use-case";
import { ControllerError } from "../../../forecast/usecases/errors/controller-error"
import { created, serverError } from "../../../forecast/usecases/helper/http-helper";
import { HttpRequest } from "../../../forecast/usecases/ports/http/http-request"
import { User } from "../../domain/user/user";

export class RegisterUserController {
  private readonly usecase: UseCase;

  constructor(usecase: UseCase) {
    this.usecase = usecase;
  }

  async handle(
    request:HttpRequest<any>
  ): Promise<HttpResponse<User | ControllerError>> {
    try {
      const response = await this.usecase.execute(request.body);

      return created<User>(response);
    } catch (error) {
      return serverError<ControllerError>(error);
    }
  }
}
