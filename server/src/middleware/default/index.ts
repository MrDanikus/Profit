import {Request} from 'express';
import config from 'config';
import cors from 'cors';
import helmet from 'helmet';
import morgan, {StreamOptions} from 'morgan';

import logger from '../../utils/logger';
import ServerError from '../../utils/errors/server-error';

type StaticOrigin = boolean | string | RegExp | (string | RegExp)[];

// Override the stream method by telling
// Morgan to use custom logger instead of the console.log.
const stream: StreamOptions = {
  write: (message: string) => logger.http(message),
};
const corsWhiteList: string[] = config.get('cors.whitelist');
const corsOptions: cors.CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, origin?: StaticOrigin) => void
  ) {
    if (!origin || corsWhiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(
        new ServerError(
          403,
          'Blocked by cors',
          'Request was blocked due to a cors policy'
        )
      );
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

morgan.token('remote-ip', (req: Request) => {
  return req.header('X-Real-Ip') || req.ip;
});
morgan.token('body', (req: Request) => {
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  return req.body ? JSON.stringify(req.body) : '';
});

export default [
  cors(corsOptions),
  helmet({
    hsts: false,
    /** Set CSP to false when used in non-production mode */
    contentSecurityPolicy:
      process.env.NODE_ENV === 'production' ? undefined : false,
  }),
  morgan(
    ':remote-ip - :response-time ms - [:date[clf]] - :status ":method :url HTTP/:http-version" :body',
    {stream}
  ),
];
