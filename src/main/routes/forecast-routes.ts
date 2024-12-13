import { Router } from 'express';

import { makeRegisterBeachController } from '@src/main/factories/controllers/register-beach-factory';
import { makeUserBeachForecastProcessingController } from '@src/main/factories/controllers/user-beach-forecast-processing-factory';

import { adaptMiddleware } from '../adapters/express-middleware-adapter';
import { adaptRoute } from '../adapters/express-route-adapter';
import { makeAuthenticateMiddleware } from '../factories/middlewares/ensure-authenticate-factory';
import { makeRateLimiterMiddleware } from '../factories/middlewares/rate-limiter-factory';

export default (router: Router): void => {
  router.post(
    '/beaches',
    adaptMiddleware(makeAuthenticateMiddleware()),
    adaptRoute(makeRegisterBeachController()),
  );

  router.get(
    '/user-beach-forecast',
    adaptMiddleware(makeAuthenticateMiddleware()),
    adaptMiddleware(makeRateLimiterMiddleware()),
    adaptRoute(makeUserBeachForecastProcessingController()),
  );
};
