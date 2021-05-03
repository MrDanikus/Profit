import {Request, Response, NextFunction} from 'express';

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

export function sanitizeRequest(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (
    MongoSanitizer.isMalicious(req.params) ||
    MongoSanitizer.isMalicious(req.body) ||
    MongoSanitizer.isMalicious(req.query)
  ) {
    return next(new SanitizerError());
  }
  return next();
}
