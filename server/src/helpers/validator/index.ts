import {Schema} from 'joi';

import ServerError from '../../utils/errors/server-error';

class ValidationError extends ServerError {
  constructor(detail: string) {
    super(422, 'Validation error', detail);
  }
}

export class Validator<T> {
  constructor(protected schema_: Schema) {}
  /**
   * @throws {ValidationError}
   *
   * Tries to validate input, if fails throw an error
   */
  validate(input: unknown): T {
    const {error, value} = this.schema_.validate(input);

    if (error) throw new ValidationError(error.message);
    return value as T;
  }

  static isObjectId(s: string): void {
    if (s.match(/^[a-f0-9]{24}$/i) === null) {
      throw new ValidationError(`${s} is not valid id`);
    }
  }
}
