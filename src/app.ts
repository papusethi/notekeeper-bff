import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import responseMessage from './constant/responseMessage';
import globalErrorHandler from './middleware/globalErrorHandler';
import router from './router/apiRouter';
import httpError from './utils/httpError';

const app = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: ['https://client.com'], // For client applicaiton
    credentials: true // For cookies
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/v1', router);

// 404 Handler
app.use((req, _res, next) => {
  try {
    throw new Error(responseMessage.NOT_FOUND('Route'));
  } catch (err) {
    httpError(next, err, req, 404);
  }
});

// Global error handler
app.use(globalErrorHandler);

export default app;
