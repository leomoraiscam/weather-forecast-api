import { Router } from 'express';
import { makeRegisterUserController } from '@src/main/factories/controllers/register-user-factory';
import { adaptRoute } from '../adapters/express-route-adapter';

export default (router: Router): void => {
  router.post('/users', adaptRoute(makeRegisterUserController()));
};
