import axios from 'axios';

import { IHttpRequest } from '../dtos/http-request';
import { IHttpResponse } from '../dtos/http-response';
import { IRequestService } from '../ports/request-service';

export class AxiosRequestService implements IRequestService {
  private request = axios;

  public get<T>({ config, url }: IHttpRequest): Promise<IHttpResponse<T>> {
    return this.request.get<T, IHttpResponse<T>>(url, config);
  }
}
