import express from 'express';

import defaultMiddleware from '../middleware/default';
const app = express();

app.set('trust proxy', 1);
app.use(defaultMiddleware);

export default app;
