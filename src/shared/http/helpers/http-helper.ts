import { IControllerError } from '@src/shared/errors/ports/controller-error';

import { HttpResponse } from '../dtos/http-response';

export function ok<T>(data?: T): HttpResponse<T> {
  return {
    statusCode: 200,
    body: data,
  };
}

export function created<T>(data: T): HttpResponse<T> {
  return {
    statusCode: 201,
    body: data,
  };
}

export function badRequest(data: IControllerError): HttpResponse<IControllerError> {
  return {
    statusCode: 400,
    body: {
      name: data.name,
      message: data.message,
    },
  };
}

export function forbidden(data: IControllerError): HttpResponse<IControllerError> {
  return {
    statusCode: 403,
    body: {
      name: data.name,
      message: data.message,
    },
  };
}

export function conflict(data: IControllerError): HttpResponse<IControllerError> {
  return {
    statusCode: 409,
    body: {
      name: data.name,
      message: data.message,
    },
  };
}

export function serverError(data: IControllerError): HttpResponse<IControllerError> {
  return {
    statusCode: 500,
    body: {
      name: 'Internal Server Error',
      message: data.message,
    },
  };
}
