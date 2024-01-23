# PlausibleFilters

A custom web component that provides filter functionality for Plausible analytics, including the ability to add, edit, and remove filters based on various criteria such as country, region, city, browser version, and more.

## Properties

| Name         | Type                      | Description                                                                 |
|--------------|---------------------------|-----------------------------------------------------------------------------|
| url          | String                    | The URL to which the filter changes will be applied.                        |
| viewport     | Number                    | The width of the viewport, used to determine if filters should be wrapped.  |
| wrapped      | Number                    | Indicates the state of filter wrapping: 0=unwrapped, 1=waiting, 2=wrapped.  |
| history      | BrowserHistory            | An instance of BrowserHistory to navigate through the query changes.        |
| addingFilter | Boolean                   | A flag indicating whether a new filter is being added.                      |
| menuOpen     | Boolean                   | A flag indicating whether the filter dropdown menu is open.                 |

## Methods

| Name                   | Parameters                  | Return Type | Description                                                                                   |
|------------------------|-----------------------------|-------------|-----------------------------------------------------------------------------------------------|
| connectedCallback      | -                           | void        | Sets up event listeners when the component is added to the DOM.                               |
| disconnectedCallback   | -                           | void        | Cleans up event listeners when the component is removed from the DOM.                         |
| updated                | changedProperties: Map      | void        | Called after the component updates, used to handle wrapping of filters and other updates.     |
| firstUpdated           | -                           | void        | Called after the component's first render, used to handle initial resizing and wrapping.      |
| handleClick            | e: MouseEvent               | void        | Handles clicks outside of the component to close the dropdown menu if it's open.              |
| removeFilter           | key: string                 | void        | Removes a filter based on the provided key and updates the query.                             |
| clearAllFilters        | -                           | void        | Clears all filters and updates the query.                                                     |
| filterText             | key: string, rawValue: string | TemplateResult | Returns a template result representing the filter text for display.                          |
| renderDropdownFilter   | filter: string[]            | TemplateResult | Renders a dropdown filter item.                                   |
| filterDropdownOption   | option: string              | TemplateResult | Renders a dropdown option for adding a filter.                                               |
| renderDropdownContent  | -                           | TemplateResult | Renders the content of the dropdown menu based on the wrapped state and addingFilter flag.   |
| handleKeyup            | e: KeyboardEvent            | void        | Handles keyup events for keyboard navigation and actions.                                     |
| handleResize           | -                           | void        | Handles window resize events to adjust the viewport property.                                 |
| rewrapFilters          | -                           | void        | Checks if the filter container is wrapping items and updates the wrapped state accordingly.   |
| renderListFilter       | filter: string[]            | TemplateResult | Renders a filter item in the list view.                                                     |
| renderDropdownButton   | -                           | TemplateResult | Renders the dropdown button based on the wrapped state.                                      |
| toggleMenu             | -                           | void        | Toggles the state of the menuOpen property.                                                   |
| renderDropDown         | -                           | TemplateResult | Renders the dropdown menu.                                                                  |
| renderFilterList       | -                           | TemplateResult | Renders the list of filters if they are not wrapped.                                         |
| render                 | -                           | TemplateResult | Renders the component's HTML template.                                                      |

## Events

- **No custom events are defined in this component.**

## Examples

```typescript
// Example usage of the PlausibleFilters component
<pl-filters
  url="/your-analytics-url"
  .history=${new BrowserHistory()}
></pl-filters>
```

Note: The above example assumes that you have an instance of `BrowserHistory` and the necessary environment to support the `pl-filters` web component.