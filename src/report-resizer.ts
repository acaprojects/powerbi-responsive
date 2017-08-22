import { Report } from 'powerbi-client';
import { extractPageMeta } from './page-meta';

/**
 * Bind to resize events on the view housing a report and switch in alternative
 * layouts as required.
 */
export const bindResizer = (report: Report) => {
    report.getPages()
        .then(pages => pages.map(extractPageMeta))
        .then(console.log);

    window.onresize = () => {
        const width = report.element.clientWidth;
        const height = report.element.clientHeight;
        console.log(`${width} x ${height}`);
    };

    return report;
};
