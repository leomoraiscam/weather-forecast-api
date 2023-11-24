import '../shared/module-alias';
import * as dotenv from 'dotenv';
import express from 'express';

import { mongoHelper } from '@src/external/database/mongodb/helpers/mongo-helper';

import { bodyParser } from './config/body-parser';
import { contentType } from './config/content-type';
import { cors } from './config/cors';
import setupRoute from './config/routes';

dotenv.config();

const app = express();

app.use(bodyParser);
app.use(cors);
app.use(contentType);

setupRoute(app);

mongoHelper
  .connect(`mongodb://${process.env.MONGO_URL}:${process.env.MONGO_PORT}/`)
  .then(async () => {
    app.listen(process.env.APP_PORT || 3000, () => {
      console.log(`Server running at http://localhost:${process.env.APP_PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.log(`Error: ${error}`);
  });

export default app;
