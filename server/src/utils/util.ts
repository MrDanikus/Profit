/**
 * Decorator for static implementation
 */
export function staticImplements<T>(): <U extends T>(constructor: U) => void {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}
/**
 * Converts object to dot notation
 *
 * @example toDotNotation({a: {b: 0}, c: 0}) -> {'a.b': 0, 'c': 0}
 * @param obj object to be converted
 *
 * @return dot notation
 */
export function toDotNotation(
  obj: Record<string, unknown>
): Record<string, unknown> {
  const res: {[key: string]: unknown} = {};
  (function recurse(obj, current: string) {
    // eslint-disable-next-line guard-for-in
    for (const key in obj) {
      const value: unknown = obj[key];
      const newKey = current ? current + '.' + key : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        recurse(value as Record<string, unknown>, newKey);
      } else {
        res[newKey] = value;
      }
    }
  })(obj, '');
  return res;
}
