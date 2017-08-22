import { Page } from 'powerbi-client';
import { bind } from './utils';

/**
 * Extract responsive layout metadata from a report page.
 */
export const extractPageMeta = (page: Page) => ({
    name: page.displayName,
    isActive: () => page.isActive,
    activate: bind(page, page.setActive),
    minWidth: 0,
    maxWidth: Number.MAX_VALUE,
    minHeight: 0,
    maxHeight: Number.MAX_VALUE
});
