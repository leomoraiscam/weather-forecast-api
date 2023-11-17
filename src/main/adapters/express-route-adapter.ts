import { Request, Response } from 'express';
import { Controller } from "../adapters/ports/controller";

export const adaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response): Promise<Response> => {   
    const { params, body, userId } = {
      body: request.body,
      params: request.query,
      userId: request.userId,
    };

    const httpResponse = await controller.handle({
      params,
      body,
      userId
    });

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      return response.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      return response.status(httpResponse.statusCode).json({
        error: httpResponse.body.error,
      })
    }
  };
};
