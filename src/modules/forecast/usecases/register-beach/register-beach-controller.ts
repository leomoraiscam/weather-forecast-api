import { HttpResponse } from "@src/shared/http/dtos/http-response"
import { UseCase  } from "@src/main/adapters/ports/use-case";
import { badRequest, conflict, created, serverError } from "@src/shared/http/helpers/http-helper";
import { HttpRequest } from "@src/shared/http/dtos/http-request"
import {  } from "../../dtos/forecast-rating-beach";
import { BeachAlreadyExistsError } from "./errors/beach-already-exists-error";
import { ControllerError } from "@src/shared/errors/ports/controller-error";
import { Beach } from "../../dtos/beach";

export class RegisterBeachController {
  private readonly usecase: UseCase;

  constructor(usecase: UseCase) {
    this.usecase = usecase;
  }

  async handle(
    request:HttpRequest<Beach>
  ): Promise<HttpResponse<Beach | ControllerError>> {
    try {
      const { body, userId } = request;

      if (!body?.name || !body?.lat || !body?.lng || !body.position) {
        const missing = !body?.name ? 'name' : !body?.lat ? 'lat' : !body?.lng ? 'lng' : 'position';

        return badRequest({
          name: 'MissingError',
          message: `Missing parameter from request: ${missing}.`
        })
      }

      const response = await this.usecase.execute({
        ...body, 
        userId
      });

      if (response.isLeft()) {
        const error = response.value

        switch (error.constructor) {
          case BeachAlreadyExistsError:
            return conflict(error)
          default:
            return badRequest(error)
        }
      } 
      
      return created<Beach>(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}

