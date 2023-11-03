import { AxiosRequestConfig } from 'axios';

export interface RequestConfig extends AxiosRequestConfig {}

export interface HttpRequest {
  url: string;
  config: RequestConfig
}
