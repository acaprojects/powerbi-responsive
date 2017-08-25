import { Page } from 'powerbi-client';
import { bind } from './utils';
import { stringToMap, parseFromMap } from './parser';

export interface PageMeta {
    name: string;
    restrictions: ViewRestrictions;
    isActive(): boolean;
    activate(): Promise<void>;
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
const parseRestrictions = stringToMap(',', ':');

/**
 * Parse a pixel value out from a restrictions Map.
 */
const pxValueFrom = parseFromMap((x: string) => parseInt(x, 10));

/**
 * Extract responsive layout metadata from a report page.
 */
export const extractPageMeta: (page: Page) => PageMeta = page => {
    const { name, meta } = parsePageName(page.displayName);
    const restrictions = parseRestrictions(meta);
    const dimension = pxValueFrom(restrictions);
    return {
        name: name.trim(),
        isActive: () => page.isActive,
        activate: bind(page, page.setActive),
        restrictions: {
            minWidth: dimension('min-width', 0),
            maxWidth: dimension('max-width', Number.MAX_VALUE),
            minHeight: dimension('min-height', 0),
            maxHeight: dimension('max-height', Number.MAX_VALUE)
        }
    };
};
