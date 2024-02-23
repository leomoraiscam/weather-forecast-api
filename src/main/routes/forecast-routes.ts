import { Router } from 'express';

import { makeRegisterBeachController } from '@src/main/factories/controllers/register-beach-factory';
import { makeFetchPointController } from '@src/main/factories/controllers/user-beach-forecast-factory';

import { adaptMiddleware } from '../adapters/express-middleware-adapter';
import { adaptRoute } from '../adapters/express-route-adapter';
import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/ensure-authenticated-middleware-factory';
import { makeRateLimiterMiddleware } from '../factories/middlewares/rate-limiter-middleware-factory';

export default (router: Router): void => {
  router.post(
    '/beaches',
    adaptMiddleware(makeEnsureAuthenticatedMiddleware()),
    adaptRoute(makeRegisterBeachController()),
  );

  router.get(
    '/user-beach-forecast',
    adaptMiddleware(makeEnsureAuthenticatedMiddleware()),
    adaptMiddleware(makeRateLimiterMiddleware()),
    adaptRoute(makeFetchPointController()),
  );
};
