import assert from 'assert';
import Joi from 'joi';

import {Validator} from '../../src/helpers/validator';

context('Validator', () => {
  it('simple schema', () => {
    assert.doesNotThrow(() =>
      new Validator<string>(Joi.string()).validate('abab')
    );
  });
  it('object schema', () => {
    const schema = Joi.object({
      a: Joi.string().required(),
      b: Joi.number().required(),
    });

    assert.doesNotThrow(() =>
      new Validator<{a: string; b: number}>(schema).validate({a: 'baba', b: 10})
    );
  });
  it('complex schema', () => {
    const schema = Joi.object({
      a: Joi.string().required(),
      b: Joi.object({
        c: Joi.array().items(Joi.string()),
        d: Joi.boolean(),
      }).required(),
    });

    assert.doesNotThrow(() =>
      new Validator<{a: string; b: {c: string[]; d: boolean}}>(schema).validate(
        {
          a: 'baba',
          b: {c: ['a', 'b'], d: true},
        }
      )
    );
  });
  it('fail simple validation', () => {
    assert.throws(() => new Validator<string>(Joi.string()).validate(10));
  });
  it('fail complex schema validation', () => {
    const schema = Joi.object({
      a: Joi.string().required(),
      b: Joi.object({
        c: Joi.array().items(Joi.string()),
        d: Joi.boolean(),
      }).required(),
    });

    assert.throws(() =>
      new Validator<{a: string; b: {c: string[]; d: boolean}}>(schema).validate(
        {
          a: 'baba',
          b: {c: ['a', 'b'], d: 10},
        }
      )
    );
  });
});
