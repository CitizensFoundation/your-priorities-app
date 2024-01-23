# PlausibleQueryData

Represents the query data structure used to store and manipulate query parameters for Plausible analytics.

## Properties

| Name            | Type                          | Description                                       |
|-----------------|-------------------------------|---------------------------------------------------|
| period          | string \| undefined           | The time period for the query.                    |
| date            | Date \| undefined             | The specific date for the query.                  |
| from            | Date \| undefined             | The start date for a custom date range.          |
| to              | Date \| undefined             | The end date for a custom date range.            |
| with_imported   | boolean                       | Flag to include imported data in the query.       |
| filters         | Record<string, string>        | A collection of filters applied to the query.     |

## Methods

| Name                  | Parameters                                  | Return Type | Description                                                                 |
|-----------------------|---------------------------------------------|-------------|-----------------------------------------------------------------------------|
| parseQuery            | querystring: string, site: PlausibleSiteData | PlausibleQueryData | Parses the query string and returns a `PlausibleQueryData` object.          |
| appliedFilters        | query: PlausibleQueryData                   | Array       | Returns an array of applied filters from the query.                         |
| generateQueryString   | data: any                                   | string      | Generates a query string from the given data.                               |
| navigateToQuery       | history: BrowserHistory, queryFrom: PlausibleQueryData, newData: PlausibleQueryData \| PlausibleQueryStringsData | void        | Navigates to a new query by updating the browser history.                   |
| toHuman               | query: PlausibleQueryData                   | string      | Converts the query data to a human-readable string.                         |
| eventName             | query: PlausibleQueryData                   | string      | Returns the event name based on the query filters.                          |

## Events (if any)

- **popstate**: Emitted when the browser history state changes.

## Examples

```typescript
// Example usage of parsing a query string
const queryData: PlausibleQueryData = parseQuery('?period=30d&date=2021-01-01', siteData);

// Example usage of generating a query string
const queryString: string = generateQueryString({ period: '30d', date: '2021-01-01' });

// Example usage of navigating to a new query
navigateToQuery(browserHistory, currentQueryData, newQueryData);
```

# BrowserHistory

Represents the browser history object used for navigating through the application's history.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| (No properties, as this is a standard browser interface) | | |

## Methods

| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| (No methods, as this is a standard browser interface) | | | |

## Events (if any)

- **pushState**: Emitted when a new state is pushed to the history stack.
- **replaceState**: Emitted when the current state is replaced with a new state.

## Examples

```typescript
// Example usage of BrowserHistory is implicit in the navigateToQuery method
```

# formattedFilters

A record that maps filter keys to their human-readable string representations.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| (Keys)        | string | The filter key.           |
| (Values)      | string | The human-readable string representation of the filter key. |

## Examples

```typescript
// Example usage of formattedFilters
const humanReadableFilter: string = formattedFilters['goal']; // 'Goal'
```