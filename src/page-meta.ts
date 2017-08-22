import { Page } from 'powerbi-client';
import { bind } from './utils';

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
 * Extract responsive layout metadata from a report page.
 */
export const extractPageMeta: (page: Page) => PageMeta = page => ({
    name: page.displayName,
    isActive: () => page.isActive,
    activate: bind(page, page.setActive),
    restrictions: {
        minWidth: 0,
        maxWidth: Number.MAX_VALUE,
        minHeight: 0,
        maxHeight: Number.MAX_VALUE
    }
});
