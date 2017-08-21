# PowerBI-Responsive

Standard [PowerBI](http://powerbi.com/) reports provide a single, static layout (and optional, secondary layout when viewed with PowerBI mobile app). This presents some challenges when embedding these within responsive UI's.

To support this, we can take advantage of the ability to build a report from multiple pages, each with their own dimensions. Once a report is prepared in this way, this library enables embedding and dynamic view selection.


## Report Structure

Build your initial PowerBI report as you would any other. For pages where you wish to support responsive layouts:
1. Duplicate the page
2. Set custom dimensions
3. Using a format similar to [CSS media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries), include any restrictions<sup>*</sup> within the page title. These should be enclosed in square brackets.

> <sup>*</sup>`min-width`, `max-width`, `min-height` and `max-height` parameters are supported with values in `px`.

For example, to enable responsive layouts for a page titled `MyReport`, create the following pages:
*   `MyReport [min-width: 960px]`
*   `MyReport [min-width: 768px]`
*   `MyReport [min-width: 480px]`
*   `MyReport [min-width: 320px]`
*   `MyReport [max-width: 320px]`

When embedded, an appropriate view will be selected (and updated if resized) and then scaled to match the final view dimensions.

Where multiple pages satisfy the restrictions of the current view, the first (left-most in PowerBI report editor) will be selected. When no layouts meet restrictions, the first will also be shown.


## Usage

### With your build system

Get the package
```bash
npm install --save-dev powerbi-responsive
```

Import it
```typescript
import { embedReport } from 'powerbi-responsive';
```

Embed away
```typescript
const container = document.getElementById('embedContainer');
const id = '<report id>';
const token = '<access token>;

embedReport(id, token, container)
    .then(() => console.log('Loaded!'))
    .catch(console.error);
```

### From a CDN



## Authentication
