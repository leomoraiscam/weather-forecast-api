import express from 'express';
// import swaggerUi from 'swagger-ui-express';

// import swaggerFile from '@src/shared/swagger.json';

import { setupMiddlewares } from './config/middleware';
import { setupRoutes } from './config/routes';

const app = express();

setupMiddlewares(app);
setupRoutes(app);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

export { app };
