import { IHttpResponse } from '@src/shared/http/dtos/http-response';

export interface IMiddleware<T = any> {
  handle: (httpRequest: T) => Promise<IHttpResponse<T>>;
}
