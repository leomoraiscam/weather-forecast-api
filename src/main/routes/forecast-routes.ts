import { Router } from 'express';

import { makeGetUserBeachesForecastController } from '@src/main/factories/controllers/get-user-beaches-forecast-factory';
import { makeRegisterBeachController } from '@src/main/factories/controllers/register-beach-factory';

import { adaptMiddleware } from '../adapters/express-middleware-adapter';
import { adaptRoute } from '../adapters/express-route-adapter';
import { makeAuthenticateMiddleware } from '../factories/middlewares/authenticate-factory';
import { makeRateLimiterMiddleware } from '../factories/middlewares/rate-limiter-factory';

export default (router: Router): void => {
  router.post(
    '/beaches',
    adaptMiddleware(makeAuthenticateMiddleware()),
    adaptRoute(makeRegisterBeachController()),
  );

  router.get(
    '/user-beaches-forecast',
    adaptMiddleware(makeAuthenticateMiddleware()),
    adaptMiddleware(makeRateLimiterMiddleware()),
    adaptRoute(makeGetUserBeachesForecastController()),
  );
};
