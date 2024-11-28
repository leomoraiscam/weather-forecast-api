import { IHttpRequest } from '../../interfaces/http-request';
import { IHttpResponse } from '../../interfaces/http-response';

export interface IControllerOperation {
  readonly requiredParams?: string[];

  handle(request: IHttpRequest): Promise<IHttpResponse>;
}
