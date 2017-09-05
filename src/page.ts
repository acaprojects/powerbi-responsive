import { isSome, fromNullable } from 'fp-ts/lib/Option';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
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
export const createResponsivePage: (views: NonEmptyArray<PageView>) => ResponsivePage
    = viewList => {
    const primary = viewList.head;
    const views = viewList.toArray();
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
