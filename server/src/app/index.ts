import {MongoDatabase} from '../db/mongo';

// connect databases
MongoDatabase.connect();

import express from 'express';

import apiRouter from '../api';

import defaultMiddleware from '../middleware/default';
import {ErrorController} from '../controllers/errors';

const app = express();

app.set('trust proxy', 1);
app.use(defaultMiddleware);
app.use('/', apiRouter);
app.use('*', ErrorController.resourceNotFound); /** error 404 */
app.use(ErrorController.errorHandler); /** express error handler */

export default app;
