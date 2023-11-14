import { Router } from 'express';

import { makeRegisterBeachController } from '@src/main/factories/register-beach';
import { makeFetchPointController } from '@src/main/factories/fetch-points';

import { adaptRoute } from '../adapters/express-route-adapter';
import { adaptMiddleware } from '../adapters/express-middleware-adapter';
import { makeEnsureAuthenticatedMiddleware } from '../factories/ensure-authenticated-middleware'


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
