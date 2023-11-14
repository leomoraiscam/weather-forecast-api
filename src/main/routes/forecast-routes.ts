import { Router } from 'express';
import { makeRegisterBeachController } from '@src/main/factories/controllers/register-beach-factory';
import { makeFetchPointController } from '@src/main/factories/controllers/fetch-points-factory';
import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/ensure-authenticated-middleware-factory'
import { adaptRoute } from '../adapters/express-route-adapter';
import { adaptMiddleware } from '../adapters/express-middleware-adapter';

export default (router: Router): void => {
  router.post(
    '/beaches',
    adaptRoute(makeRegisterBeachController())
  );

  router.get(
    '/fetch-points',
    adaptMiddleware(makeEnsureAuthenticatedMiddleware()),
    adaptRoute(makeFetchPointController())
  );
};
