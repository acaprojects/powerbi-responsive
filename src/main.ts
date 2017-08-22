import { service } from 'powerbi-client';
import { embedReport } from './report-embed';
import { extend } from './utils';

// Export usage in other modules
export { embedReport } from './report-embed';

// ...and extend the window.powerbi object for direct use
const api = {
    embedResponsiveReport: embedReport
};
const win = (window as { powerbi?: service.Service});
win.powerbi = extend(win.powerbi, api);
