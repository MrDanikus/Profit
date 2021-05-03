import {Request, Response, NextFunction} from 'express';
import queryString from 'query-string';

import {Middleware} from '../../base';

import ServerError from '../../../utils/errors/server-error';

declare module 'express' {
  export interface Request {
    query: Record<string, unknown>;
  }
}

class QueryTooLongError extends ServerError {
  constructor() {
    super(
      413,
      'Query max length has been exceeded',
      'Search query is too long to process'
    );
  }
}

type QueryParseOptions = queryString.ParseOptions & {
  /* query length limit in bytes */
  limit?: number;
};

function parseQuery(options?: QueryParseOptions) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const query = req.originalUrl.split('?')[1] || '';

    if (query.length > (options?.limit || 300)) {
      return next(new QueryTooLongError());
    }

    req.query = queryString.parse(
      query,
      Object.assign({}, options, {
        decode: true,
        parseNumbers: true,
        parseBooleans: true,
        arrayFormat: 'comma',
      })
    );

    return next();
  };
}

export class QueryParser extends Middleware {
  constructor(protected options?: QueryParseOptions) {
    super();
  }

  middleware = parseQuery(this.options);
}
