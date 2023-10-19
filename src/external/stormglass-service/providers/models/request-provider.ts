import { AxiosRequestConfig } from 'axios';

export interface RequestConfig extends AxiosRequestConfig {}

export interface HttpRequest {
  url: string;
  config: RequestConfig
}

export interface HttpResponse<T> {
  status: number;
  data: any
}

export interface IRequestProvider {
  get<T>({ url, config }: HttpRequest): Promise<HttpResponse<T>>;
}

