import { compose, constant, tuple, Function1 } from 'fp-ts/lib/function';
import { Option, isSome, fromNullable } from 'fp-ts/lib/Option';
import { mapO } from './utils';

type KeyVal = [string, string];

/**
 * Given a regexp execute it on a string to search, returning the result as a
 * Option type so we can keep some sanity and don't have to deal with nulls.
 */
export const match = (re: RegExp) => (x: string) => fromNullable(re.exec(x));

/**
 * Lookup a value from an es6 map, providing the result as an Option type.
 */
export const lookup = <T, U>(m: Map<T, U>, key: T) => fromNullable(m.get(key));

/**
 * Split a string into a tuple containing the parts to the left and right of
 * the first occurance of a seperator.
 */
export const splitOn = (seperator: string) =>
    compose(
        mapO<RegExpExecArray, KeyVal>(([_, l, r]) => tuple(l, r)),
        match(new RegExp(`(.*)${seperator}(.*)`))
    );

/**
 * Split and trim a string into a [key, val] tuple.
 */
export const toKeyVal = (seperator: string) =>
    compose(
        mapO<KeyVal, KeyVal>(([k, v]) => [k.trim(), v.trim()]),
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
                .filter(isSome)
                .map(p => p.getOrElse(() => {
                    // This should never fire as we filtered above, but just in case...
                    throw new Error(`Error parsing properties from:\n${x}`);
                }))
        );

/**
 * Wrapper for querying value from within a Map and parsing them on the way out.
 */
export const parseFromMap = <T, U, V>(parser: Function1<U, V>) =>
    (propMap: Map<T, U>) =>
        (key: T, fallback: V) =>
            lookup(propMap, key)
                .map(parser)
                .getOrElse(constant(fallback));
