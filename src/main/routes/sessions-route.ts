import { Router } from 'express';

import { makeAuthenticateUserController } from '@src/main/factories/authenticate-user';

import { adaptRoute } from '../adapters/express-route-adapter';

export default (router: Router): void => {
  router.post(
    '/sessions',
    adaptRoute(makeAuthenticateUserController())
  );
};
