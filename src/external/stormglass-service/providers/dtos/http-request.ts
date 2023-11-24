import { AxiosRequestConfig } from 'axios';

export interface IRequestConfig extends AxiosRequestConfig {}

export interface IHttpRequest {
  url: string;
  config: IRequestConfig;
}
