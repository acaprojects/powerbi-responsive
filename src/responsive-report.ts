import { models, Report, Page, IEmbedConfiguration } from 'powerbi-client';
import { embed } from './embedder';
import { merge } from './utils';

const baseConfig: IEmbedConfiguration = {
    type: 'report',
    id: undefined,
    embedUrl: 'https://app.powerbi.com/reportEmbed',
    tokenType: models.TokenType.Embed,
    accessToken: undefined,
    permissions: models.Permissions.Read,
    settings: {
        filterPaneEnabled: false,
        navContentPaneEnabled: false
    }
};

/**
 * Extract responsive layout metadata from a page.
 */
const extractPage = (page: Page) => {
    return {
        name: page.displayName,
        isActive: () => page.isActive,
        activate: page.setActive.bind(page),
        minWidth: 0,
        maxWidth: Number.MAX_VALUE,
        minHeight: 0,
        maxHeight: Number.MAX_VALUE
    };
};
const bindResizer = (report: Report) => {
    // TODO bind to view resize events
    return report;
};

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
    return queryPages().then(pages => pages.map(extractPage));
};

/**
 * Expose a set of actions on a reponsive report that are safe to be passed to
 * the outside world.
 */
const exposeActions = (report: Report) => ({
    setPage: setPage(report),
    reload: report.reload.bind(report),
    setAccessToken: report.setAccessToken.bind(report),
    fullscreen: report.fullscreen.bind(report),
    exitFullscreen: report.exitFullscreen.bind(report)
    getPages,
});

/**
 * Embed a view-only, reponsive report in the specified element.
 *
 * The report should be formed with mutliple pages, providing appropriate
 * layouts for different view sizes.
 */
export const embedReport = (id: string, accessToken: string, container: HTMLElement, opts: IEmbedConfiguration = {}) =>
    embed<Report>(container, merge(baseConfig, opts, {id, accessToken}))
        .then(bindResizer)
        .then(exposeActions);
