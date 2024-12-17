import { IHttpResponse } from './http-response';

export interface IController<T = any> {
  readonly requiredParams?: string[];

  handle: (request: T) => Promise<IHttpResponse<T>>;
}
