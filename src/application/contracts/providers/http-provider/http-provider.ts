import { HttpRequestConfig } from './dtos/http-request-config';
import { IHttpResponse } from './dtos/http-response';

export interface IHttpProvider {
  get<T>(url: string, config?: HttpRequestConfig): Promise<IHttpResponse<T>>;
}
