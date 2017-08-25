/**
 * Unary function from A -> B
 */
export type Func<A, B> = (x: A) => B;

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
export const bind = <T extends Function>(thisArg: any, f: T) => f.bind(thisArg) as T;

/**
 * Retrieve the nth item from a list.
 */
export const nth = (index: number) => <T>(xs: T[]) => xs[index];

/**
 * Extract the items from a list that appear at the provided indicies.
 */
export const items = (indicies: number[]) => <T>(xs: T[]) => indicies.map(i => xs[i]);

/**
 * Given two indicies and a list, extract items at these indicies to an
 * appropriately typed tuple.
 */
export const tuple = (a: number, b: number) => <T>(xs: T[]) =>
    [a, b].map(nth).map(f => f(xs)) as [T, T];

/**
 * Well typed, right-to-left composition of a pair of unary functions.
 */
export const compose = <A, B, C>(f: Func<B, C>, g: Func<A, B>) => (x: A) => f(g(x));
