import { Function1, Predicate } from 'fp-ts/lib/function';
import { Option, fromNullable } from 'fp-ts/lib/Option';

/**
 * Wrap a unary function from A -> B | null into a function from A -> Option<B>.
 */
export const asOption:
    <A, B>(f: Function1<A, B | null | undefined>) => Function1<A, Option<B>>
    = f => x => fromNullable(f(x));

/**
 * Curried map on Option types.
 */
export const mapO = <A, B>(f: Function1<A, B>) => (x: Option<A>) => x.map(f);

/**
 * Curried map on lists.
 */
export const mapL = <A, B>(f: Function1<A, B>) => (xs: A[]) => xs.map(f);

/**
 * Given a collection of objects of the same type, merge them. Duplicate keys
 * will be overridden such that the right-most is favoured.
 */
export const merge = <T>(...xs: T[]) => Object.assign({}, ...xs) as T;

/**
 * Given two object create a new (shallow clone) object that combines the
 * properties of both. Duplicate keys will be overridden in preference of `b`.
 */
export const extend = <A, B>(a: A, b: B) => merge<A | B>(a, b) as A & B;

/**
 * Bind a function to a specific context, preserving the type of the orginal
 * function.
 */
// tslint:disable-next-line:ban-types
export const bind = <T extends Function>(thisArg: any, f: T) =>
    f.bind(thisArg) as T;

/**
 * Check is a predicate evaluates to true for any elements of a list.
 */
export const anyTrue = <T>(xs: T[], f: Predicate<T>) =>
    xs.reduce((p, x) => f(x) || p, false);

/**
 * Check is a predicate evaluates to true for all elements of a list.
 */
export const allTrue = <T>(xs: T[], f: Predicate<T>) =>
    xs.reduce((p, x) => f(x) && p, true);

/**
 * Given a collection of elements of the same type, combine them into a map of
 * lists of like objects, keyed on the chosen property value.
 */
export const group = <T, K extends keyof T>(xs: T[], prop: K) =>
    xs.reduce((m, x) => {
        const key = x[prop];
        const siblings = m.get(key) || [];
        m.set(key, siblings.concat(x));
        return m;
    }, new Map<T[K], T[]>());

/**
 * Find the first element in a list that matches a predicate.
 */
export const find = <T>(f: Predicate<T>) => (xs: T[]) =>
    fromNullable<T>(xs.find(f));
