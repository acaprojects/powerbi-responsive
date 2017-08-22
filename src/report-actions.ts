import { Report, Page } from 'powerbi-client';
import { IFilter } from 'powerbi-models';
import { extractPageMeta } from './page-meta';
import { bind } from './utils';

export { models } from 'powerbi-client';

/**
 * Set the active page.
 *
 * If multiple responsive layouts are present the appropirate sized one will
 * be selected for the current view.
 */
const setPage = (report: Report) => (name: string) => {
    // TODO implement page activation
    return report.setPage(name);
};

/**
 * Get a list of all pages within the report.
 *
 * Where multiple, reponsive layouts exist for a page, these will be merged
 * into a single entity.
 */
const getPages = (report: Report) => {
    const queryPages = report.getPages.bind(report) as () => Promise<Page[]>;
    return queryPages().then(pages => pages.map(extractPageMeta));
};

/**
 * Expose a set of actions on a reponsive report that are safe to be passed to
 * the outside world.
 */
export const bindActions = (report: Report) => ({
    setPage: setPage(report),
    getPages: () => getPages(report),
    getFilters: bind(report, report.getFilters) as () => Promise<IFilter[]>,
    setFilters: bind(report, report.setFilters),
    reload: bind(report, report.reload),
    setAccessToken: bind(report, report.setAccessToken),
    fullscreen: bind(report, report.fullscreen),
    exitFullscreen: bind(report, report.exitFullscreen)
});
