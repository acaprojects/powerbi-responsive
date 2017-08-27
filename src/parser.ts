import { Maybe } from 'tsmonad';
import { compose, tuple, Func } from './utils';

/**
 * Check if a Maybe contains a value.
 */
const isJust = <T>(a: Maybe<T>) => a.caseOf({
    just: () => true,
    nothing: () => false
});

/**
 * Given a regexp execute it on a string to search, returning the result as a
 * Maybe monad so we can keep some sanity and don't have to deal with nulls.
 */
export const match = (re: RegExp) => (x: string) => {
    const result = re.exec(x);
    return result
        ? Maybe.just(result)
        : Maybe.nothing<RegExpExecArray>();
};

/**
 * Split a string into a tuple containing the parts to the left and right of
 * the first occurance of a seperator.
 */
export const splitOn = (seperator: string) =>
    compose(
        result => result.fmap(tuple(1, 2)),
        match(new RegExp(`(.*)${seperator}(.*)`))
    );

/**
 * Split and trim a string into a [key, val] tuple.
 */
export const toKeyVal = (seperator: string) =>
    compose(
        result => result.fmap(x => x.map(y => y.trim()) as [string, string]),
        splitOn(seperator)
    );

/**
 * Parse a string containing a set of key/value pairs into a Map.
 */
export const stringToMap = (propDelimiter: string | RegExp, keyValDelimiter: string) =>
    (x: string) =>
        new Map(
            x.split(propDelimiter)
                .map(toKeyVal(keyValDelimiter))
                .filter(isJust)
                .map(p => p.valueOrThrow())
        );

/**
 * Wrapper for querying value from within a Map and parsing them on the way out.
 */
export const parseFromMap = <T, U, V>(parser: Func<U, V>) =>
    (map: Map<T, U>) =>
        (key: T, fallback: V) => {
            const value = map.get(key);
            return value
                ? parser(value)
                : fallback;
        };
