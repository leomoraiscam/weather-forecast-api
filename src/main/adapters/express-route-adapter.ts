import { Request, Response } from 'express';

import { IController } from '@src/presentation/contracts/controller';

export const adaptRoute = (controller: IController) => {
  return async (request: Request, response: Response): Promise<void> => {
    const { body, userId, query } = {
      body: request.body,
      query: request.query,
      userId: request.userId,
    };

    const httpResponse = await controller.handle({
      body,
      query,
      userId,
    });

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
