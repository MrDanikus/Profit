export class MongoSanitizer {
  private static TEST_REGEX = /^(\$+|\.+)/g;
  /**
   * Checks the input object for malicious data
   *
   * @param input input object
   * @return true if the input has
   * no malicious data and false otherwise
   */
  static isMalicious(input: unknown): boolean {
    if (Array.isArray(input)) {
      return input.reduce(
        (acc: boolean, cur: unknown) =>
          (acc ||= MongoSanitizer.isMalicious(cur)),
        false
      );
    } else if (typeof input === 'object' && input) {
      for (const key in input) {
        if (
          MongoSanitizer.isMalicious(key) ||
          MongoSanitizer.isMalicious((input as Record<string, unknown>)[key])
        ) {
          return true;
        }
      }
      return false;
    } else if (typeof input === 'string') {
      return input.match(MongoSanitizer.TEST_REGEX) !== null;
    } else {
      return false;
    }
  }
  /**
   * Sanitize input object. Remove strings
   * that contain leading dot or `$`.
   *
   * @param input input object
   * @return sanitized object
   */
  static sanitize<T>(input: T): unknown {
    if (Array.isArray(input)) {
      return input.map(MongoSanitizer.sanitize);
    } else if (typeof input === 'object' && input) {
      for (const key in input) {
        if (key.match(MongoSanitizer.TEST_REGEX) !== null) delete input[key];
        else
          input[key] = MongoSanitizer.sanitize(input[key]) as T[Extract<
            keyof T,
            string
          >];
      }
    } else if (typeof input === 'string') {
      return input.replaceAll(MongoSanitizer.TEST_REGEX, '');
    }
    return input;
  }
}
