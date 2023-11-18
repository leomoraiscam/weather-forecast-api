import { Router } from 'express';
import { makeAuthenticateUserController } from '@src/main/factories/controllers/authenticate-user-factory';
import { adaptRoute } from '../adapters/express-route-adapter';

export default (router: Router): void => {
  router.post('/sessions', adaptRoute(makeAuthenticateUserController()));
};
