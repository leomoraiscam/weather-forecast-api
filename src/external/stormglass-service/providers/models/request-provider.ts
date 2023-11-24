import { IHttpRequest } from '../dtos/http-request';
import { IHttpResponse } from '../dtos/http-response';

export interface IRequestProvider {
  get<T>({ url, config }: IHttpRequest): Promise<IHttpResponse<T>>;
}
