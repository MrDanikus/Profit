import express from 'express';

import defaultMiddleware from '../middleware/default';
import {ErrorController} from '../controllers/errors';

const app = express();

app.set('trust proxy', 1);
app.use(defaultMiddleware);

app.use('*', ErrorController.resourceNotFound); /** error 404 */
app.use(ErrorController.errorHandler); /** express error handler */

export default app;
