import { Express } from 'express';

import { bodyParser } from '../middleware/body-parser';
import { contentType } from '../middleware/content-type';
import { cors } from '../middleware/cors';

export const setupMiddlewares = (app: Express): void => {
  app.use(bodyParser);
  app.use(cors);
  app.use(contentType);
};
