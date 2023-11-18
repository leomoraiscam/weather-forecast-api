import axios from 'axios';
import { HttpRequest } from '../dtos/http-request';
import { HttpResponse } from '../dtos/http-response';
import { IRequestProvider } from '../models/request-provider';

export class AxiosRequestProvider implements IRequestProvider {
  constructor(private request = axios) {}

  public get<T>({ config, url }: HttpRequest): Promise<HttpResponse<T>> {
    return this.request.get<T, HttpResponse<T>>(url, config);
  }
}
