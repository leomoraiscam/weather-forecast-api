import { IControllerError } from '@src/shared/errors/ports/controller-error';

import { IHttpResponse } from '../dtos/http-response';

export function ok<T>(data?: T): IHttpResponse<T> {
  return {
    statusCode: 200,
    body: data,
  };
}

export function created<T>(data: T): IHttpResponse<T> {
  return {
    statusCode: 201,
    body: data,
  };
}

export function badRequest(data: IControllerError): IHttpResponse<IControllerError> {
  return {
    statusCode: 400,
    body: {
      name: data.name,
      message: data.message,
    },
  };
}

export function unauthorized(data: IControllerError): IHttpResponse<IControllerError> {
  return {
    statusCode: 401,
    body: {
      name: data.name,
      message: data.message,
    },
  };
}

export function forbidden(data: IControllerError): IHttpResponse<IControllerError> {
  return {
    statusCode: 403,
    body: {
      name: data.name,
      message: data.message,
    },
  };
}

export function notFound(data: IControllerError): IHttpResponse<IControllerError> {
  return {
    statusCode: 404,
    body: {
      name: data.name,
      message: data.message,
    },
  };
}

export function conflict(data: IControllerError): IHttpResponse<IControllerError> {
  return {
    statusCode: 409,
    body: {
      name: data.name,
      message: data.message,
    },
  };
}

export function toManyRequests(data: IControllerError): IHttpResponse<IControllerError> {
  return {
    statusCode: 422,
    body: {
      name: data.name,
      message: data.message,
    },
  };
}

export function serverError(data: IControllerError): IHttpResponse<IControllerError> {
  return {
    statusCode: 500,
    body: {
      name: 'Internal Server Error',
      message: data.message,
    },
  };
}
