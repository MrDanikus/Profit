import {Request, Response, NextFunction} from 'express';

import {Middleware} from '../base';

import {MongoSanitizer} from '../../helpers/mongo-sanitizer';

import ServerError from '../../utils/errors/server-error';

class SanitizerError extends ServerError {
  constructor() {
    super(
      400,
      'Request contains malicious data',
      'Response was blocked due the danger to the server'
    );
  }
}

export class RequestSanitizer extends Middleware {
  constructor() {
    super();
  }

  middleware(req: Request, _res: Response, next: NextFunction): void {
    if (
      MongoSanitizer.isMalicious(req.params) ||
      MongoSanitizer.isMalicious(req.body) ||
      MongoSanitizer.isMalicious(req.query)
    ) {
      return next(new SanitizerError());
    }
    return next();
  }
}
