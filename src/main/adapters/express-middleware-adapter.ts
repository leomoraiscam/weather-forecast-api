import { Request, Response, NextFunction } from 'express';

import { IMiddleware } from './ports/middleware';

export const adaptMiddleware = (middleware: IMiddleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const requestData = {
      accesstoken: request.headers['x-access-token'],
      ...(request.headers || {}),
      ip: request.ip,
    };

    const httpResponse = await middleware.handle(requestData, request.body);

    if (!httpResponse) {
      return response.status(200).send();
    }

    if (httpResponse.statusCode === 200) {
      Object.assign(request, httpResponse.body);

      return next();
    }

    return response.status(httpResponse.statusCode).json({
      name: httpResponse.body.name,
      message: httpResponse.body.message,
    });
  };
};
