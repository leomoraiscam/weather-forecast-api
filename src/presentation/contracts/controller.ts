import { IHttpResponse } from '@src/shared/http/dtos/http-response';

export interface IController<T = any> {
  handle: (request: T) => Promise<IHttpResponse<T>>;
}
