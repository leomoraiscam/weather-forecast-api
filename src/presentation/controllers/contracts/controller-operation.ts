import { IHttpRequest } from './http-request';
import { IHttpResponse } from './http-response';

export interface IControllerOperation {
  readonly requiredParams?: string[];

  handle(request: IHttpRequest): Promise<IHttpResponse>;
}
