import axios from 'axios';
import { HttpRequest, HttpResponse } from "../models/request-provider"
import { IRequestProvider } from "../models/request-provider"

export class AxiosRequestProvider implements IRequestProvider{
  constructor(private request = axios) {}

  public get<T>({ config, url }: HttpRequest): Promise<HttpResponse<T>> {
    return this.request.get<T, HttpResponse<T>>(url, config)
  }
}
