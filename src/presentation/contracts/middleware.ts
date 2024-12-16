import { IHttpResponse } from './http-response';

export interface IMiddleware<T = any> {
  handle: (httpRequest: T) => Promise<IHttpResponse<T>>;
}
