import { isSome, fromNullable } from 'fp-ts/lib/Option';
import { constant } from 'fp-ts/lib/function';
import { PageView } from './view';
import { find } from './utils';

/**
 * Wrapper for a set of responsive page layouts.
 */
export interface ResponsivePage {
    name: string;
    views: PageView[];
    isActive(): boolean;
    activate(): Promise<void>;
}

/**
 * Pick the default PageView from a list.
 */
// TODO convert to using NonEmptyArray
const defaultView = (views: PageView[]) =>
    fromNullable(views[0])
        .getOrElse(() => {
            throw new Error('no views in view list');
        });

/**
 * Find the active view from a list of PageViews.
 */
const active = find<PageView>(v => v.isActive());

/**
 * Get the first showable view from a list of options.
 */
const showable = find<PageView>(v => v.canShow());

/**
 * Form a set of views info a ResponsivePage.
 */
export const createResponsivePage: (views: PageView[]) => ResponsivePage = views => {
    const primary = defaultView(views);
    return {
        name: primary.name,
        views,
        isActive: () => isSome(active(views)),
        activate: () => showable(views).getOrElse(constant(primary)).activate()
    };
};

/**
 * Pointfree page activation.
 */
export const activate = (page: ResponsivePage) => page.activate();

/**
 * Pointfree page status query.
 */
export const isActive = (page: ResponsivePage) => page.isActive();
