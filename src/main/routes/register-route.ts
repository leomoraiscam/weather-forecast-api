import { Router } from 'express';

import { makeFetchPointController } from '@src/main/factories/fetch-points';

import { adaptRoute } from '../adapters/express-route-adapter';

export default (router: Router): void => {
  router.get(
    '/fetch-points',
    adaptRoute(makeFetchPointController())
  );
};
