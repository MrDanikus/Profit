import {Request, Response, NextFunction} from 'express';

import logger from '../../utils/logger';
import ServerError from '../../utils/errors/server-error';

type AnyError = ServerError | SyntaxError | Error;
type RestError = {
  readonly code: string;
  readonly status: number;
  readonly message: string;
  readonly detail: string;
  readonly source: {
    readonly link: string;
    readonly stack?: string;
  };
};

export class ErrorController {
  /**
   * Middleware that handles 405(method not allowed) error.
   *
   * @return passes the 405 error to the next handler (error handler).
   */
  public static methodNotAllowed(
    _req: Request,
    _res: Response,
    next: NextFunction
  ): void {
    return next(
      new ServerError(405, 'Method is not allowed', 'Try to use another method')
    );
  }
  /**
   * Middleware that handles 404(not found) error.
   *
   * @return passes the 404 error to the next handler (error handler).
   */
  public static resourceNotFound(
    _req: Request,
    _res: Response,
    next: NextFunction
  ): void {
    return next(
      new ServerError(
        404,
        'Not found',
        'Requested resource was not found on the server'
      )
    );
  }
  /**
   * Creates and sends error response.
   *
   * @return handle errors and send an appropriate response.
   */
  public static errorHandler(
    error: AnyError | AnyError[],
    req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    const errors: RestError[] = [];

    for (let err of Array.isArray(error) ? error : [error]) {
      if (err instanceof SyntaxError) {
        const {stack} = err;
        err = new ServerError(
          400,
          'There are syntax errors in request',
          'Check request for typos'
        );
        err.stack = stack;
      } else if (!(err instanceof ServerError)) {
        const {stack} = err;
        err = new ServerError(
          500,
          'Unexpected server error',
          'Contact technical support'
        );
        err.stack = stack;
        logger.error(JSON.stringify(stack, null, 2));
      }
      if (process.env.NODE_ENV === 'production') {
        err.stack = undefined;
      }

      errors.push({
        code: (err as ServerError).code,
        status: (err as ServerError).status,
        message: err.message,
        detail: (err as ServerError).detail,
        source: {
          link: req.url,
          stack: err.stack,
        },
      });
    }

    res.status(errors[0].status).json({errors});
  }
}
