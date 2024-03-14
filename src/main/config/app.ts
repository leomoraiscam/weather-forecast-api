import express from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerFile from '@src/shared/swagger.json';

import setupMiddleware from './middleware';
import setupRoute from './routes';

const app = express();

setupMiddleware(app);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

setupRoute(app);

export default app;
