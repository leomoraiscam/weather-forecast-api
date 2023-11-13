import { Router } from 'express';

import { makeRegisterBeachController } from '@src/main/factories/register-beach';
import { makeFetchPointController } from '@src/main/factories/fetch-points';

import { adaptRoute } from '../adapters/express-route-adapter';

export default (router: Router): void => {
  router.post(
    '/beaches',
    adaptRoute(makeRegisterBeachController())
  );

  router.get(
    '/fetch-points',
    adaptRoute(makeFetchPointController())
  );
};
