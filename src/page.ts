import { PageView } from './view';
import { find, maybe, isJust } from './utils';

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
const defaultView = (views: PageView[]) =>
    maybe(views[0]).valueOrThrow(new Error('no views in view list'));

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
        isActive: () => isJust(active(views)),
        activate: () => showable(views).valueOr(primary).activate()
    };
};
