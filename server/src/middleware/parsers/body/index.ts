import {json} from 'express';

type BodyParseOptions = {
  limit?: number;
};

export function parseBody(options?: BodyParseOptions) {
  return json(options);
}
