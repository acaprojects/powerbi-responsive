/**
 * Get a string contained between two other strings, falling back to an empty
 * string if either `from` or `to` cannot be found.
 */
export const between = (from: string, to: string) => (search: string) => {
    const match = new RegExp(`${from}(.*)${to}`).exec(search);
    return match && match.length ? match[1] : '';
};

/**
 * Split a string into a tuple containing the parts to the left and right of
 * the first occurance of a seperator.
 */
export const splitOn = (seperator: string) => (x: string) => {
    const [h, ...t] = x.split(seperator);
    return [h, t.join(seperator)] as [string, string];
};

/**
 * Split and trim a string into a [key, val] tuple.
 */
export const toKeyVal = (seperator: string) => (x: string) => {
    const split = splitOn(seperator);
    const trim = (s: string) => s.trim();
    return split(x).map(trim) as [string, string];
};

/**
 * Parse a string containing a set of key/value pairs into a Map.
 */
export const parseToMap = (propDelimiter: string | RegExp, keyValDelimiter: string) =>
    (x: string) =>
        new Map(x.split(propDelimiter).map(toKeyVal(keyValDelimiter)));

/**
 * A function where converts between two types.
 */
type transform<T, U> = (a: T) => U;

/**
 * Wrapper for querying value from within a Map and parsing them on the way out.
 */
export const extract = <T, U, V>(parser: transform<U, V>) =>
    (map: Map<T, U>) =>
        (key: T, fallback: V) => {
            const value = map.get(key);
            return value
                ? parser(value)
                : fallback;
            };
