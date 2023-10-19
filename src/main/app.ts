import '../shared/module-alias'
import express from 'express';
import setupMiddleware from './middleware';
import setupRoute from './config/routes';

const app = express();

setupMiddleware(app);
setupRoute(app);

app.listen(process.env.APP_PORT || 3000, () => {
  console.log(
    `Server running at http://localhost:${process.env.APP_PORT || 3000}`
  );
});

export default app;
