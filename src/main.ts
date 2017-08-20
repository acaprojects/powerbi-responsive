import { embedReport } from './responsive-report';

// Export usage in other modules
export { embedReport } from './responsive-report';

// ...and extend the window.powerbi object for direct use
const win = (window as { powerbi?: any});
win.powerbi = win.powerbi || {};
win.powerbi.embedResponsiveReport = embedReport;
