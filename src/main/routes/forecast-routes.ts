import { Router } from 'express';

import { makeFetchPointController } from '@src/main/factories/controllers/fetch-points-factory';
import { makeRegisterBeachController } from '@src/main/factories/controllers/register-beach-factory';

import { adaptMiddleware } from '../adapters/express-middleware-adapter';
import { adaptRoute } from '../adapters/express-route-adapter';
import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/ensure-authenticated-middleware-factory';

export default (router: Router): void => {
  router.post(
    '/beaches',
    adaptMiddleware(makeEnsureAuthenticatedMiddleware()),
    adaptRoute(makeRegisterBeachController()),
  );

  router.get(
    '/fetch-points',
    adaptMiddleware(makeEnsureAuthenticatedMiddleware()),
    adaptRoute(makeFetchPointController()),
  );
};
