import express from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerFile from '@src/shared/swagger.json';

import { bodyParser } from './body-parser';
import { contentType } from './content-type';
import { cors } from './cors';
import setupRoute from './routes';

const app = express();

app.use(bodyParser);
app.use(cors);
app.use(contentType);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

setupRoute(app);

export default app;
