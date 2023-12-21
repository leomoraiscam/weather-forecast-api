import axios from 'axios';

import { IHttpRequest } from '../dtos/http-request';
import { IHttpResponse } from '../dtos/http-response';
import { IRequestProvider } from '../ports/request-provider';

export class AxiosRequestProvider implements IRequestProvider {
  private request = axios;

  public get<T>({ config, url }: IHttpRequest): Promise<IHttpResponse<T>> {
    return this.request.get<T, IHttpResponse<T>>(url, config);
  }
}
