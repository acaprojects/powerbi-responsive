import { Page } from 'powerbi-client';
import { Maybe } from 'tsmonad';
import { bind, group } from './utils';
import { stringToMap, parseFromMap } from './parser';

export interface PageView {
    name: string;
    restrictions: ViewRestrictions;
    isActive(): boolean;
    activate(): Promise<void>;
    canShow(): boolean;
}

export interface ViewRestrictions {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
}

/**
 * Parse a page name into it's title and metadata components.
 */
const parsePageName = (pageName: string) => {
    const [, name, meta] = /(.*)\s*\[(.*)\]/.exec(pageName) || [] as string[];
    return {
        name: name || pageName,
        meta: meta || ''
    };
};

/**
 * Parse a string containing page metadata into a Map.
 */
const parsePageMeta = stringToMap(',', ':');

/**
 * Parse a pixel value out from a restrictions Map.
 */
const pxValueFrom = parseFromMap((x: string) => parseInt(x, 10));

/**
 * Check if the current state of a report container satisfy a set of view
 * restrictions.
 */
const viewable = (container: HTMLElement, restrictions: ViewRestrictions) =>
    restrictions.minWidth <= container.clientWidth &&
    restrictions.maxWidth >= container.clientWidth &&
    restrictions.minHeight <= container.clientHeight &&
    restrictions.maxHeight >= container.clientHeight;

/**
 * Extract responsive layout metadata from a report page.
 */
const extractToView: (page: Page) => PageView = page => {
    const { name, meta } = parsePageName(page.displayName);
    const restrictionDefs = parsePageMeta(meta);
    const dimension = pxValueFrom(restrictionDefs);
    const restrictions: ViewRestrictions = {
        minWidth: dimension('min-width', 0),
        maxWidth: dimension('max-width', Number.MAX_VALUE),
        minHeight: dimension('min-height', 0),
        maxHeight: dimension('max-height', Number.MAX_VALUE)
    };
    return {
        name: name.trim(),
        isActive: () => page.isActive,
        activate: bind(page, page.setActive),
        canShow: () => viewable(page.report.iframe, restrictions),
        restrictions
    };
};

/**
 * Map a list of raw pages into a list of lists of related PageViews.
 */
export const groupPages = (pages: Page[]) => {
    const views = pages.map(extractToView);
    const pageMap = group(views, 'name');
    return Array.from(pageMap.values());
};
