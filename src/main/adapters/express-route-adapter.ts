import { Request, Response } from 'express';

import { FetchPointsController } from '@src/modules/forecast/web-controllers/fetch-points-controller';

export const adaptRoute = (controller: FetchPointsController) => {
  return async (request: Request, response: Response): Promise<void> => {
    const httpRequest = {
      params: request.query,
    };

    const httpResponse = await controller.handle(httpRequest);

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
