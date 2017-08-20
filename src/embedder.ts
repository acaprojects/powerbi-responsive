import { service, factories, Embed, IEmbedConfiguration } from 'powerbi-client';

const powerbi = new service.Service(
    factories.hpmFactory,
    factories.wpmpFactory,
    factories.routerFactory);

/**
 * Embed a PowerBI object in the specified element.
 */
export const embed = <T extends Embed>(container: HTMLElement, config: IEmbedConfiguration) =>
    new Promise<T>((resolve, reject) => {
        const item = powerbi.embed(container, config);
        item.on('loaded', () => resolve(item as T));
        item.on('error', e => reject(e.detail));
    });
