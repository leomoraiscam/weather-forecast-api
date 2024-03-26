import { Router } from 'express';

import { makeRegisterBeachController } from '@src/main/factories/controllers/register-beach-factory';
import { makeUserBeachForecastProcessingController } from '@src/main/factories/controllers/user-beach-forecast-processing-factory';

import { adaptMiddleware } from '../adapters/express-middleware-adapter';
import { adaptRoute } from '../adapters/express-route-adapter';
import { makeEnsureAuthenticateMiddleware } from '../factories/middlewares/ensure-authenticate-factory';
import { makeRateLimiterMiddleware } from '../factories/middlewares/rate-limiter-factory';

export default (router: Router): void => {
  router.post(
    '/beaches',
    adaptMiddleware(makeEnsureAuthenticateMiddleware()),
    adaptRoute(makeRegisterBeachController()),
  );

  router.get(
    '/user-beach-forecast',
    adaptMiddleware(makeEnsureAuthenticateMiddleware()),
    adaptMiddleware(makeRateLimiterMiddleware()),
    adaptRoute(makeUserBeachForecastProcessingController()),
  );
};
