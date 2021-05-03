import {Request, Response, NextFunction} from 'express';

interface IMiddleware {
  (req: Request, res: Response, next: NextFunction): void;
}

interface IMiddlewareConstructor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): IMiddleware;
}

abstract class MiddlewareClass extends Function {
  private bound_: MiddlewareClass;

  constructor() {
    super('...args', 'return this.bound_.middleware(...args)');
    this.bound_ = this.bind(this);

    return this.bound_;
  }

  abstract middleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): void | Promise<void>;
}

export const Middleware = (MiddlewareClass as unknown) as IMiddlewareConstructor;
