import assert from 'assert';
import {MongoSanitizer} from '../../src/helpers/mongo-sanitizer';

context('Mongo Sanitizer', () => {
  describe('isMalicious', () => {
    it('should validate clean string', () => {
      const input = 'clean string';
      assert.ok(!MongoSanitizer.isMalicious(input));
    });
    it('should validate empty array', () => {
      const input: string[] = [];
      assert.ok(!MongoSanitizer.isMalicious(input));
    });
    it('should validate clean object', () => {
      const input = {
        clean: 2,
        string: 'no data',
        someFunc: () => {
          return 'test';
        },
      };
      assert.ok(!MongoSanitizer.isMalicious(input));
    });
    it('malicious string', () => {
      const input = '$not';
      assert.ok(MongoSanitizer.isMalicious(input));
    });
    it('malicious array', () => {
      const input = ['some', 'string', '$$THIS'];
      assert.ok(MongoSanitizer.isMalicious(input));
    });
    it('malicious object', () => {
      const input = {
        $not: {
          password: null,
        },
      };
      assert.ok(MongoSanitizer.isMalicious(input));
    });
  });
  describe('sanitize', () => {
    it('sanitize clean string', () => {
      const input = 'teststring';
      assert.strictEqual(MongoSanitizer.sanitize(input), input);
    });
    it('sanitize malicious string', () => {
      assert.strictEqual(MongoSanitizer.sanitize('$not:smth'), 'not:smth');
      assert.strictEqual(MongoSanitizer.sanitize('$$THIS'), 'THIS');
      assert.strictEqual(MongoSanitizer.sanitize('..test.not'), 'test.not');
    });
    it('sanitize malicious object', () => {
      assert.deepStrictEqual(
        MongoSanitizer.sanitize({
          $not: 'password',
          some: 'string',
        }),
        {
          some: 'string',
        }
      );
    });
    it('sanitize malicious array', () => {
      assert.deepStrictEqual(
        MongoSanitizer.sanitize([1, {some: 'key'}, '$not', '$$THIS']),
        [1, {some: 'key'}, 'not', 'THIS']
      );
    });
  });
});
