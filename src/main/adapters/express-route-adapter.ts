import { Request, Response } from 'express';

import { FetchPointsController } from '@src/modules/forecast/usecases/processForecastForBeaches/process-forecast-for-beaches-controller';

export const adaptRoute = (controller: FetchPointsController) => {
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
