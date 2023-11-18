import '../shared/module-alias';
import express from 'express';
import * as dotenv from 'dotenv';
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
  .connect(`mongodb://localhost:16017`)
  .then(async () => {
    app.listen(process.env.APP_PORT || 3000, () => {
      console.log(`Server running at http://localhost:${process.env.APP_PORT || 3000}`);
    });
  })
  .catch((error: any) => {
    console.log(`Error: ${error}`);
  });

export default app;
