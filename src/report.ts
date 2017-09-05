import { models, Report, IEmbedConfiguration } from 'powerbi-client';
import { IFilter } from 'powerbi-models';
import ResizeObserver from 'resize-observer-polyfill';
import { compose } from 'fp-ts/lib/function';
import { Option } from 'fp-ts/lib/Option';
import { embed } from './embedder';
import { groupViews } from './view';
import { createResponsivePage, ResponsivePage, activate, isActive } from './page';
import { merge, extend, bind, find, mapL, mapP, bindP, getOrThrow } from './utils';

/**
 * A set of functions that may be used to interact with an embedded report.
 */
export interface ReportActions {
    setPage(name: string): Promise<void>;
    getPages(): Promise<ResponsivePage[]>;
    getPage(): Promise<ResponsivePage>;
    getFilters(): Promise<IFilter[]>;
    setFilters(filters: IFilter[]): Promise<void>;
    reload(): Promise<void>;
    setAccessToken(token: string): Promise<void>;
    fullscreen(): void;
    exitFullscreen(): void;
}

/**
 * Base embedder config.
 */
const baseConfig: IEmbedConfiguration = {
    type: 'report',
    embedUrl: 'https://app.powerbi.com/reportEmbed',
    tokenType: models.TokenType.Embed,
    permissions: models.Permissions.Read,
    settings: {
        filterPaneEnabled: false,
        navContentPaneEnabled: false
    }
};

/**
 * Embed a view-only, reponsive report in the specified element.
 *
 * The report should be formed with mutliple pages, providing appropriate
 * layouts for different view sizes.
 */
export const embedReport = (id: string, accessToken: string, container: HTMLElement, opts: IEmbedConfiguration = {}) =>
    embed<Report>(container, merge(baseConfig, opts, {id, accessToken}))
        .then(registerEvents)
        .then(bindActions);

/**
 * Get a list of all pages within the report.
 */
const getPages = (report: Report) =>
    bind(report, report.getPages)()
        .then(groupViews)
        .then(mapL(createResponsivePage));

/**
 * Lookup a page within a report by name.
 */
const getPage = (report: Report) => (name: string) =>
    getPages(report)
        .then(find(p => p.name === name))
        .then(getOrThrow(`Could not find page titled ${name}`));

/**
 * Set the page within a responsive report.
 */
const setPage = (report: Report) => compose(
    bindP(activate),
    getPage(report)
);

/**
 * Get the currently active page within a report.
 */
const getActivePage = compose(
    mapP<Option<ResponsivePage>, ResponsivePage>(
        // Should never happen, but just in case...
        getOrThrow('Could not find active page')
    ),
    mapP(find(isActive)),
    getPages
);

/**
 * Reactivate the current page, selecting the most appopriate view for the
 * given state.
 */
const resetView = compose(
    bindP(activate),
    getActivePage
);

/**
 * Expose a set of actions on a reponsive report that are safe to be passed to
 * the outside world.
 */
const bindActions: (report: Report) => ReportActions = report => ({
    setPage: setPage(report),
    getPages: () => getPages(report),
    getPage: () => getActivePage(report),
    getFilters: bind(report, report.getFilters),
    setFilters: bind(report, report.setFilters),
    reload: bind(report, report.reload),
    setAccessToken: bind(report, report.setAccessToken),
    fullscreen: bind(report, report.fullscreen),
    exitFullscreen: bind(report, report.exitFullscreen)
});

/**
 * Bind to resize events on the view housing a report and switch in alternative
 * layouts as required.
 */
const registerEvents = (report: Report) => {
    // TODO debounce
    const ro = new ResizeObserver(() => resetView(report));
    ro.observe(report.iframe);

    return extend(report, {__resizeObserver: ro});
};
