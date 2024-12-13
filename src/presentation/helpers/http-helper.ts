import { IHttpResponse } from '../contracts/http-response';

export const ok = <T>(data: T): IHttpResponse<T> => ({
  statusCode: 200,
  body: data,
});

export const created = <T>(data: T): IHttpResponse<T> => ({
  statusCode: 201,
  body: data,
});

export const badRequest = (error: Error): IHttpResponse<Error> => ({
  statusCode: 400,
  body: error,
});

export const unauthorized = (error: Error): IHttpResponse<Error> => ({
  statusCode: 401,
  body: error,
});

export const notFound = (error: Error): IHttpResponse<Error> => ({
  statusCode: 404,
  body: error,
});

export const conflict = (error: Error): IHttpResponse<Error> => ({
  statusCode: 409,
  body: error,
});

export const unprocessableEntity = (error: Error): IHttpResponse<Error> => ({
  statusCode: 422,
  body: error,
});

export const toManyRequests = (error: Error): IHttpResponse<Error> => {
  return {
    statusCode: 429,
    body: error,
  };
};

export const serverError = (error: Error): IHttpResponse<Error> => ({
  statusCode: 500,
  body: { message: error.message } as unknown as Error,
});
