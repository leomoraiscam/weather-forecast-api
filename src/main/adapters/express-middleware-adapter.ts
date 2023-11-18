import { Request, Response, NextFunction } from 'express';

import { Middleware } from './ports/middleware';

export const adaptMiddleware = (middleware: Middleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    let requestData = {
      accesstoken: request.headers['x-access-token'],
      ...(request.headers || {}),
    };

    const httpResponse = await middleware.handle(requestData, request.body);

    if (httpResponse === false) {
      return response.status(200).send();
    }

    if (httpResponse.statusCode === 200) {
      Object.assign(request, httpResponse.body);

      return next();
    } else {
      return response.status(httpResponse.statusCode).json({
        error: httpResponse.body.error,
      });
    }
  };
};
