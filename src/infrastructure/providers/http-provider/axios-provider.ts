import axios, { AxiosRequestConfig } from 'axios';

import { HttpRequestConfig } from '@src/application/contracts/providers/http-provider/dtos/http-request-config';
import { IHttpResponse } from '@src/application/contracts/providers/http-provider/dtos/http-response';
import { IHttpProvider } from '@src/application/contracts/providers/http-provider/http-provider';
import { ILoggerProvider } from '@src/application/contracts/providers/logger-provider/logger-provider';

import { HttpInterceptor } from './interceptors/http-inteceptors';

export class AxiosProvider implements IHttpProvider {
  private client = axios;

  constructor(private loggerProvider: ILoggerProvider) {
    this.setupInterceptors();
  }

  private mapConfig(config?: HttpRequestConfig): AxiosRequestConfig {
    return {
      headers: config?.headers,
      params: config?.params,
      timeout: config?.timeout,
      ...config,
    };
  }

  public async get<T>(url: string, config?: HttpRequestConfig): Promise<IHttpResponse<T>> {
    const axiosConfig: AxiosRequestConfig = this.mapConfig(config);

    return this.client.get<T, IHttpResponse<T>>(url, axiosConfig);
  }

  private setupInterceptors(): void {
    const interceptor = new HttpInterceptor(this.loggerProvider);

    this.client.interceptors.request.use(
      (config) => interceptor.requestInterceptor(config),
      (error) => interceptor.errorInterceptor(error),
    );

    this.client.interceptors.response.use(
      (response) => interceptor.responseInterceptor(response),
      (error) => interceptor.errorInterceptor(error),
    );
  }
}
