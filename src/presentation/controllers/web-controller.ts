import { IController } from '@src/presentation/contracts/controller';
import { IHttpRequest } from '@src/presentation/contracts/http-request';
import { IHttpResponse } from '@src/presentation/contracts/http-response';
import { badRequest, serverError } from '@src/presentation/helpers/http-helper';

import { MissingParamError } from '../errors/missing-param-error';

export class WebController {
  constructor(private controllerOperation: IController) {}

  public async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const missingParams: string = WebController.getMissingParams(
        request,
        this.controllerOperation.requiredParams,
      );

      if (missingParams) {
        return badRequest(new MissingParamError(missingParams));
      }
      return await this.controllerOperation.handle(request);
    } catch (error) {
      return serverError(error);
    }
  }

  public static getMissingParams(request: IHttpRequest, requiredParams: string[]): string {
    const missingParams: string[] = [];

    (requiredParams || []).forEach((name) => {
      if (!Object.keys(request.body).includes(name)) {
        missingParams.push(name);
      }
    });

    return missingParams.join(', ');
  }
}
