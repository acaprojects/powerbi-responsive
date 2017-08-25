/**
 * Unarcy function from A -> B
 */
export type Func<A, B> = (x: A) => B;

/**
 * Given a collection of objects of the same type, merge them. Duplicate keys
 * will be overridden such that the right-most is favoured.
 */
export const merge = <T>(...xs: T[]) => Object.assign(Object.create(null), ...xs) as T;

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
 * Extract the items from a list that appear at the provided indicies.
 */
export const extract = (indicies: number[]) => <T>(xs: T[]) => indicies.map(i => xs[i]);

/**
 * Well typed, right-to-left composition of a pair of unary functions.
 */
export const compose = <A, B, C>(f: Func<B, C>, g: Func<A, B>) => (x: A) => f(g(x));
