import { service, factories, models, Embed, Report, IEmbedConfiguration } from 'powerbi-client';

const powerbi = new service.Service(
    factories.hpmFactory,
    factories.wpmpFactory,
    factories.routerFactory);

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
 * Given a collection of objects of the same type, merge them. Duplicate key
 * will be overridden such that the right-most is favoured.
 */
const override = <T>(...xs: T[]) => Object.assign({}, ...xs) as T;

/**
 * Embed a PowerBI object in the specified element.
 */
const embed = <T extends Embed>(container: HTMLElement, config: IEmbedConfiguration) =>
    new Promise<T>((resolve, reject) => {
        const item = powerbi.embed(container, config);
        item.on('loaded', () => resolve(item as T));
        item.on('error', e => reject(e.detail));
    });

const bindResizer = (report: Report) => {
    // TODO bind to view resize events
    return report;
};

/**
 * Embed a view-only, reponsive report in the specified element.
 *
 * The report should be formed with mutliple pages, providing appropriate
 * layouts for different view sizes.
 */
export const embedReport = (id: string, accessToken: string, container: HTMLElement, opts: IEmbedConfiguration = {}) =>
    embed<Report>(container, override(baseConfig, opts, {id, accessToken}))
        .then(bindResizer)
        .then(report => ({
            reload: report.reload,
            setAccessToken: report.setAccessToken,
            fullscreen: report.fullscreen,
            exitFullscreen: report.exitFullscreen
        }));
