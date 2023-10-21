import { Request, Response } from 'express';
import { Controller } from "../ports/controller";

export const adaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response): Promise<void> => {   
    const { params, body } = {
      body: request.body,
      params: request.query
    };

    const httpResponse = await controller.handle({
      params,
      body
    });

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
