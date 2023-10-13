import { Request, Response } from 'express';

import { FetchPointsController } from '@src/modules/forecast/usecases/processForecastForBeaches/process-forecast-for-beaches-controller';

export const adaptRoute = (controller: FetchPointsController) => {
  return async (request: Request, response: Response): Promise<void> => {
    const httpRequest = {
      lat: request.query.lat,
      lng: request.query.lng
    };

    const { lat, lng } = httpRequest

    const httpResponse = await controller.handle({
      params: {
        lat: Number(lat),
        lng: Number(lng)
      }
    });

    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
