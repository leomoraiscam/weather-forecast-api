/* eslint-disable no-useless-constructor */
import axios from 'axios';

import { IHttpRequest } from '../dtos/http-request';
import { IHttpResponse } from '../dtos/http-response';
import { IRequestProvider } from '../models/request-provider';

export class AxiosRequestProvider implements IRequestProvider {
  constructor(private request = axios) {}

  public get<T>({ config, url }: IHttpRequest): Promise<IHttpResponse<T>> {
    return this.request.get<T, IHttpResponse<T>>(url, config);
  }
}
