import { models, Report, IEmbedConfiguration } from 'powerbi-client';
import { embed } from './embedder';
import { bindActions } from './report-actions';
import { bindResizer } from './report-resizer';
import { merge } from './utils';

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
        .then(bindResizer)
        .then(bindActions);
