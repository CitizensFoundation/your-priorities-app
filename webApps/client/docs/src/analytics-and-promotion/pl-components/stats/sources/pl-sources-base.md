# PlausibleSourcesBase

PlausibleSourcesBase is a class that extends PlausibleBaseElementWithState and is responsible for managing the state and behavior of source-related components in the Plausible analytics dashboard. It handles the display and interaction with different UTM tags, referrer data, and the state of the component such as whether it's loading, open, or showing certain elements.

## Properties

| Name            | Type                             | Description                                                                 |
|-----------------|----------------------------------|-----------------------------------------------------------------------------|
| tab             | PlausibleSourcesTabOptions       | The currently selected tab option.                                          |
| referrers       | PlausibleReferrerData[] \| undefined | An array of referrer data or undefined if not set.                          |
| loading         | Boolean                          | Indicates if the component is currently loading data.                       |
| open            | Boolean                          | Indicates if the dropdown or collapsible element is open.                   |
| alwaysShowNoRef | Boolean                          | Determines if the 'No Referrer' option should always be shown.              |

## Methods

| Name             | Parameters                                  | Return Type | Description                                                                 |
|------------------|---------------------------------------------|-------------|-----------------------------------------------------------------------------|
| fetchReferrers   |                                             | void        | A method to fetch referrer data.                                            |
| updated          | changedProperties: Map<string \| number \| symbol, unknown> | void        | Overrides the updated lifecycle method to handle property changes.          |
| toggleOpen       |                                             | void        | Toggles the `open` state of the component.                                  |
| get label        |                                             | string      | Computes the label based on the current query period and conversion rate.   |
| get showConversionRate |                                       | boolean     | Determines if the conversion rate should be shown based on the current query.|
| get showNoRef    |                                             | boolean     | Determines if the 'No Referrer' option should be shown based on conditions. |
| setTab           | tab: PlausibleSourcesTabOptions            | void        | Sets the current tab to the specified option.                               |
| faviconUrl       | referrer: string                            | string      | Generates the URL for a referrer's favicon.                                 |
| setAllTab        |                                             | void        | Sets the tab to 'all' and closes the dropdown.                              |
| renderTabs       |                                             | TemplateResult | Renders the tabs for UTM options and the 'All' option.                     |

## Events

- **tab-changed**: Emitted when the tab property changes.

## Examples

```typescript
// Example usage of PlausibleSourcesBase
const plausibleSourcesBase = new PlausibleSourcesBase();
plausibleSourcesBase.tab = 'utm_source';
plausibleSourcesBase.referrers = [
  { name: 'Google', visitors: 100 },
  { name: 'Bing', visitors: 50 }
];
plausibleSourcesBase.loading = false;
plausibleSourcesBase.open = true;
plausibleSourcesBase.alwaysShowNoRef = false;

// Fetch referrers
plausibleSourcesBase.fetchReferrers();

// Toggle open state
plausibleSourcesBase.toggleOpen();

// Set a specific tab
plausibleSourcesBase.setTab('utm_campaign');

// Get favicon URL
const favicon = plausibleSourcesBase.faviconUrl('https://example.com');

// Set all tab
plausibleSourcesBase.setAllTab();
```