import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import { TypesLogger } from '@src/application/contracts/providers/logger-provider/enums/types-logger-enum';
import { ILoggerProvider } from '@src/application/contracts/providers/logger-provider/logger-provider';

export class HttpInterceptor {
  constructor(private loggerProvider: ILoggerProvider) {}

  public requestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    this.loggerProvider.log({
      level: TypesLogger.INFO,
      message: `[REQUEST] ${config.method?.toUpperCase()} ${config.url}`,
      metadata: {
        data: config.data,
        method: config.method,
      },
    });

    return { ...config, requestStartTime: new Date() } as InternalAxiosRequestConfig;
  }

  public responseInterceptor(response: AxiosResponse): AxiosResponse {
    this.loggerProvider.log({
      level: TypesLogger.INFO,
      message: `[RESPONSE] ${response.config.method.toUpperCase()} ${response.status} ${
        response.config.url
      }`,
      metadata: {
        data: response.data,
        duration: `${new Date().getTime() - response.config?.['requestStartTime']}ms`,
      },
    });

    return response;
  }

  public errorInterceptor(error: AxiosError): Promise<AxiosError> {
    this.loggerProvider.log({
      level: TypesLogger.ERROR,
      message: `[ERROR] ${error.config.method.toUpperCase()} ${error.config.url}${
        error.response?.status
      }: ${error.message}`,
      metadata: {
        status: error.response?.status || 500,
        error: error.response?.data,
        method: error.config.method,
        duration: `${new Date().getTime() - error.config?.['requestStartTime']}ms`,
      },
    });

    return Promise.reject(error);
  }
}
