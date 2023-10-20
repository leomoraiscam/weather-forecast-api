import { Router } from 'express';

import { makeRegisterUserController } from '@src/main/factories/register-user';

import { adaptRoute } from '../adapters/express-route-adapter';

export default (router: Router): void => {
  router.post(
    '/register-user',
    adaptRoute(makeRegisterUserController())
  );
};
