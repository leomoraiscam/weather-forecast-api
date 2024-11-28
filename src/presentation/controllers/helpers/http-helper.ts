import { IHttpResponse } from '../../interfaces/http-response';

export const created = <T>(data: T): IHttpResponse<T> => ({
  statusCode: 201,
  body: data,
});

export const badRequest = (error: Error): IHttpResponse<Error> => ({
  statusCode: 400,
  body: error,
});

export const conflict = (error: Error): IHttpResponse<Error> => ({
  statusCode: 409,
  body: error,
});

export const serverError = (error: Error): IHttpResponse<Error> => ({
  statusCode: 500,
  body: error,
});
