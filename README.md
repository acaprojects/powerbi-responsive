# PowerBI-Responsive

[![Build Status](https://travis-ci.org/acaprojects/powerbi-responsive.svg?branch=master)](https://travis-ci.org/acaprojects/powerbi-responsive)
[![Code Climate](https://codeclimate.com/github/acaprojects/powerbi-responsive/badges/gpa.svg)](https://codeclimate.com/github/acaprojects/powerbi-responsive)
[![Dependencies Status](https://david-dm.org/acaprojects/powerbi-responsive/status.svg)](https://david-dm.org/acaprojects/powerbi-responsive)
[![Dev Dependencies Status](https://david-dm.org/acaprojects/powerbi-responsive/dev-status.svg)](https://david-dm.org/acaprojects/powerbi-responsive?type=dev)
[![npm version](https://badge.fury.io/js/powerbi-responsive.svg)](https://badge.fury.io/js/powerbi-responsive)

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
*   `MyReport [min-width: 768px, max-width: 1200px]`
*   `MyReport [max-width: 768px]`

When embedded, an appropriate view is selected (and updated if resized) and then scaled to match the final view dimensions.

Where more than one page satisfies the restrictions of the current view, the first (left-most in PowerBI report editor) is used. When no layouts meet restrictions, the first will also be shown.


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
const token = '<access token>';

embedReport(id, token, container)
    .then(() => console.log('Loaded!'))
    .catch(console.error);
```


### From a CDN

Add the script to your page
```html
<script src="//unpkg.com/powerbi-responsive/dist/bundle.min.js"></script>
```

This will bootstrap the [powerbi-client](https://github.com/Microsoft/PowerBI-JavaScript) and expand it to provide responsive report embedding
```javascript
powerbi.embedResponsiveReport(id, token, container)
    .then(() => console.log('Loaded!'))
    .catch(console.error);
```


## Authentication

To embed reports, you must supply a [JSON web token](https://jwt.io/introduction/) that grants access to the resource. There are two strategies for providing these and their usage will depend on your application requirements.

![](https://dpspowerbi.blob.core.windows.net/powerbi-prod-media/powerbi.microsoft.com/en-us/documentation/articles/powerbi-developer-embedding/20170721095914/powerbi-embed-flow.png)


### User owns data

For applications where all users are also PowerBI users, authentication should follow [Azure Active Directory's OAuth 2.0 authorization code flow](https://docs.microsoft.com/en-au/azure/active-directory/develop/active-directory-protocols-oauth-code). The secured `resource` requested must be `https://analysis.windows.net/powerbi/api`.

If using this approach you must inform powerbi-repsonsive that you are using an AAD token via an embed option:
```javascript
powerbi.embedResponsiveReport(id, token, container, {tokenType: 0})
    .then(() => console.log('Loaded!'))
    .catch(console.error);
```


### App owns data

For use cases where all users of your application need to be provided with access to a report, the PowerBI API provides an endpoint for generating embed tokens. To access this, your application back-end must first authenticate with Azure Active Directory in order to gain access to the PowerBI API. This can be achieved via the [resource owner flow / password grant type](https://tools.ietf.org/html/rfc6749#section-4.3).
```bash
curl -X POST https://login.windows.net/<tennant id>/oauth2/token \
  -d grant_type="password" \
  -d client_id="<your client id>" \
  --data-urlencode client_secret="<your client secret>" \
  --data-urlencode resource="https://analysis.windows.net/powerbi/api" \
  --data-urlencode username="<service account user>" \
  --data-urlencode password="<service account pass>"
```

Once authenticated, generate a report view token via PowerBI's [GenerateToken](https://msdn.microsoft.com/en-us/library/mt784614.aspx) endpoint. If required, this request may also include identity information (user, roles) for preserving [row-level security](https://powerbi.microsoft.com/en-us/documentation/powerbi-developer-embedded-rls/) within the embedded report.
```bash
curl -X POST \
  https://api.powerbi.com/v1.0/myorg/groups/<group id>/reports/<report id>/GenerateToken \
  -H 'authorization: Bearer <bearer token from above>' \
  -H 'content-type: application/json' \
  -d '{ "accessLevel": "View" }'
```

The token returned may then be safely passed to your front end.

> **A note on security:** do *not* attempt to generate these tokens from your front end. Your `client_secret` should remain that, a *secret*. Similarly, the bearer token returned from Azure Active Directory contains the identity information of your service account and should not be provided to clients.


## Interacting with reports

When embedding a report you will be provided with a `Promise`. If there is an issue with authentication, access to the report, or access to the PowerBI service this will reject with an object containing the error details. Otherwise, it will resolve with a [an object containing a set of report actions](https://acaprojects.github.io/powerbi-responsive/interfaces/_src_report_.reportactions.html). These may be used by your application to interact with the embedded report.
