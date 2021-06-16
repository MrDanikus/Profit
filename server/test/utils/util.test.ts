import assert from 'assert';

import * as Utils from '../../src/utils/util';

context('utils', () => {
  describe('toDotNotation', () => {
    it('plain object', () => {
      const obj = {
        a: 1,
        b: 2,
      };

      assert.deepStrictEqual(Utils.toDotNotation(obj), {a: 1, b: 2});
    });
    it('array', () => {
      const obj = {
        a: 1,
        b: ['a', 'b', 'c'],
      };

      assert.deepStrictEqual(Utils.toDotNotation(obj), {
        a: 1,
        b: ['a', 'b', 'c'],
      });
    });
    it('complex object', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3,
          },
        },
      };

      assert.deepStrictEqual(Utils.toDotNotation(obj), {
        a: 1,
        'b.c': 2,
        'b.d.e': 3,
      });
    });
    it('empty object', () => {
      assert.deepStrictEqual(Utils.toDotNotation({}), {});
    });
  });
});
