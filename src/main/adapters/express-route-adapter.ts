import { Request, Response } from 'express';
import { Controller } from "../adapters/ports/controller";

export const adaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response): Promise<void> => {   
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

    response.status(httpResponse.statusCode).json(httpResponse.body)
  };
};
