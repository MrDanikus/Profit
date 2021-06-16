import {json} from 'express';

import {Middleware} from '../../base';

type BodyParseOptions = {
  limit?: number;
};

function parseBody(options?: BodyParseOptions) {
  return json(options);
}

export class BodyParser extends Middleware {
  constructor(protected options?: BodyParseOptions) {
    super();
  }

  middleware = parseBody(this.options);
}
