import './module-alias';
import * as dotenv from 'dotenv';

import { mongoHelper } from '@src/infrastructure/database/mongo/helpers/mongo-helper';

dotenv.config();

mongoHelper
  .connect(`mongodb://${process.env.MONGO_URL}:${process.env.MONGO_PORT}/`)
  .then(async () => {
    const { app } = await import('./app');

    app.listen(process.env.APP_PORT || 3000, () => {
      console.log(`Server running at http://localhost:${process.env.APP_PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.log(`Error: ${error}`);
  });
