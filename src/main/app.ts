import '../shared/module-alias'
import express from 'express';
import * as dotenv from 'dotenv';
import { mongoHelper } from '@src/external/repositories/mongodb/helpers/mongo-helper';
import setupMiddleware from './middleware';
import setupRoute from './config/routes';

dotenv.config();

const app = express();

setupMiddleware(app);
setupRoute(app);

mongoHelper
  .connect(`mongodb://localhost:16017`)
  .then(async () => {
    app.listen(process.env.APP_PORT || 3000, () => {
      console.log(
        `Server running at http://localhost:${process.env.APP_PORT || 3000}`
      );
    });
  })
  .catch((error: any) => {
    console.log(`Error: ${error}`);
  });

export default app;
