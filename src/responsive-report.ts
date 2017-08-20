import { models, Report, IEmbedConfiguration } from 'powerbi-client';
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
    embed<Report>(container, merge(baseConfig, opts, {id, accessToken}))
        .then(bindResizer)
        .then(report => ({
            reload: report.reload.bind(report),
            setAccessToken: report.setAccessToken.bind(report),
            fullscreen: report.fullscreen.bind(report),
            exitFullscreen: report.exitFullscreen.bind(report)
        }));
