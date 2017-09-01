import { models, Report, IEmbedConfiguration } from 'powerbi-client';
import { IFilter } from 'powerbi-models';
import { embed } from './embedder';
import { groupPages, PageView } from './page';
import { merge, bind, compose, anyTrue, map, find, maybe, isJust } from './utils';

/**
 * A set of functions that may be used to interact with an embedded report.
 */
export interface ReportActions {
    setPage(name: string): Promise<void>;
    getPages(): Promise<ResponsivePage[]>;

    getFilters(): Promise<IFilter[]>;
    setFilters(filters: IFilter[]): Promise<void>;

    reload(): Promise<void>;

    setAccessToken(token: string): Promise<void>;

    fullscreen(): void;
    exitFullscreen(): void;
}

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
 * Form a set of views info a ResponsivePage.
 */
const createResponsivePage: (views: PageView[]) => ResponsivePage = views => {
    const defaultView = maybe(views[0]).valueOrThrow();
    const findActive = find<PageView>(v => v.isActive());
    const getView = find<PageView>(v => v.canShow());
    return {
        name: defaultView.name,
        views,
        isActive: () => isJust(findActive(views)),
        activate: () => getView(views).valueOr(defaultView).activate()
    };
};

/**
 * Get a list of all pages within the report.
 */
const getPages: (report: Report) => Promise<ResponsivePage[]> = report =>
    bind(report, report.getPages)()
        .then(groupPages)
        .then(map(createResponsivePage));

/**
 * Lookup a page within a report by name.
 */
const getPage = (report: Report, name: string) =>
    getPages(report).then(find(p => p.name === name));

/**
 * Set the page within a responsive report.
 */
const setPage = (report: Report) => (name: string) =>
    getPage(report, name)
        .then(page => page
            .valueOrThrow(new Error(`Could not find page titled ${name}`))
            .activate());

/**
 * Expose a set of actions on a reponsive report that are safe to be passed to
 * the outside world.
 */
const bindActions: (report: Report) => ReportActions = report => ({
    setPage: setPage(report),
    getPages: () => getPages(report),
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
    getPages(report)
        .then(console.log);

    window.onresize = () => {
        const width = report.element.clientWidth;
        const height = report.element.clientHeight;
        // console.log(`${width} x ${height}`);
    };

    return report;
};
