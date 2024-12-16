import { IHttpResponse } from './http-response';

export interface IController<T = any> {
  handle: (request: T) => Promise<IHttpResponse<T>>;
}
