# PlausableListReport

A custom web component that extends `PlausibleBaseElementWithState` to display a list report with various properties and methods to fetch and render data.

## Properties

| Name               | Type                                  | Description                                                                 |
|--------------------|---------------------------------------|-----------------------------------------------------------------------------|
| prevQuery          | PlausibleQueryData                    | The previous query data used for comparison to determine if data should be fetched again. |
| tabKey             | string                                | The key used to identify the active tab.                                   |
| valueKey           | string                                | The key used to identify the value in the list items.                       |
| keyLabel           | string                                | The label for the key column in the list.                                   |
| color              | string \| undefined                   | The color used for the list item background.                                |
| valueLabel         | string \| undefined                   | The label for the value column in the list.                                 |
| storedTab          | string \| undefined                   | The stored tab key, if any.                                                 |
| externalLinkDest   | Function \| undefined                 | A function that returns the destination URL for an external link.           |
| showConversionRate | boolean \| undefined                  | A flag indicating whether to show the conversion rate.                      |
| detailsLink        | string \| undefined                   | The URL to the details page for more information.                           |
| onClick            | Function \| undefined                 | A function to be called when an item is clicked.                            |
| fetchDataFunction  | Function                              | The function to be called to fetch the list data.                           |
| filter             | Record<any, any> \| undefined         | The filter to be applied to the list items.                                 |
| list               | PlausibleListItemData[] \| undefined  | The list of items to be displayed.                                          |
| loading            | boolean                               | A flag indicating whether the component is currently loading data.          |

## Methods

| Name            | Parameters | Return Type | Description                                                                 |
|-----------------|------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback | none       | void        | Lifecycle method that runs when the component is added to the DOM. It sets up the timer and default values. |
| getExternalLink | item: PlausibleListItemData | TemplateResult \| typeof nothing | Returns a template for an external link or nothing if not applicable. |
| firstUpdated    | _changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method that runs after the component's first render. It triggers data fetching. |
| updated         | changedProperties: Map<string \| number \| symbol, unknown> | void | Lifecycle method that runs when the component's properties change. It may trigger data fetching. |
| fetchData       | none       | void        | Fetches data using the provided `fetchDataFunction` and updates the component state. |
| renderListItem  | listItem: PlausibleListItemData | TemplateResult | Renders a single list item. |
| renderList      | none       | TemplateResult \| typeof nothing | Renders the list of items or nothing if the list is empty. |
| render          | none       | TemplateResult | Renders the entire component. |

## Events

- **No custom events are defined in this component.**

## Examples

```typescript
// Example usage of the PlausableListReport component
<pl-list-report
  .prevQuery=${prevQueryData}
  tabKey="traffic"
  valueKey="visitors"
  keyLabel="Source"
  color="blue"
  valueLabel="Visitors"
  storedTab="lastTab"
  .externalLinkDest=${(item) => `https://example.com/${item.id}`}
  showConversionRate={true}
  detailsLink="/details"
  .onClick=${(event) => console.log('Item clicked', event)}
  .fetchDataFunction=${() => fetchListData()}
  .filter=${{ source: 'sourceKey' }}
  .list=${listData}
  loading={false}
></pl-list-report>
```

Please note that the example above assumes that `prevQueryData`, `fetchListData`, and `listData` are defined in your context and that they provide the necessary data and functionality for the component to operate.