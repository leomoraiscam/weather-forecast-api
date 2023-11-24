import { IHttpResponse } from '@src/shared/http/dtos/http-response';

export interface IMiddleware<T = any, U = any> {
  handle: (httpRequest: T, httpBody?: U) => Promise<IHttpResponse<any> | false>;
}
