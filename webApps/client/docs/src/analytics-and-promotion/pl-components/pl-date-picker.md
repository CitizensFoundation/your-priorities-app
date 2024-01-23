# PlausibleDatePicker

`PlausibleDatePicker` is a custom web component that extends `PlausibleBaseElementWithState` to provide a date picker functionality for selecting date ranges or specific dates. It integrates with a site's statistics and navigation history to update queries based on the selected date or period.

## Properties

| Name               | Type                         | Description                                                                 |
|--------------------|------------------------------|-----------------------------------------------------------------------------|
| history            | BrowserHistory               | The browser history object used for navigation.                             |
| dropdownNode       | HTMLDivElement               | A reference to the dropdown element in the DOM.                             |
| calendar           | LitFlatpickr                 | A reference to the LitFlatpickr component used for the calendar functionality. |
| leadingText        | string \| undefined          | Optional text to display before the selected time frame.                    |
| mode               | string                       | The mode of the date picker, which can be 'menu' or 'calendar'.             |
| open               | boolean                      | Indicates whether the date picker dropdown is open.                         |
| dayBeforeCreation  | number \| undefined          | The timestamp representing the day before the site's creation date.         |

## Methods

| Name             | Parameters                   | Return Type | Description                                                                 |
|------------------|------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback| -                            | void        | Lifecycle method that runs when the component is added to the DOM.          |
| disconnectedCallback| -                        | void        | Lifecycle method that runs when the component is removed from the DOM.      |
| updated          | changedProperties: Map       | void        | Lifecycle method that runs when the component's properties have changed.    |
| renderArrow      | period: string, prevDate: string, nextDate: string | TemplateResult | Renders the navigation arrows for the date picker. |
| datePickerArrows | -                            | TemplateResult \| typeof nothing | Renders the appropriate date picker arrows based on the current period. |
| handleKeydown    | e: KeyboardEvent             | boolean     | Handles keydown events for date navigation and shortcuts.                   |
| handleClick      | e: MouseEvent                | void        | Handles click events outside the dropdown to close it.                      |
| setCustomDate    | dates: string[]              | void        | Sets a custom date range based on the selected dates from the calendar.     |
| timeFrameText    | -                            | string      | Returns the text representation of the selected time frame.                 |
| toggle           | -                            | void        | Toggles the visibility of the date picker dropdown.                         |
| close            | -                            | void        | Closes the date picker dropdown.                                            |
| openCalendar     | -                            | Promise<void> | Opens the calendar for selecting a custom date range.                     |
| renderLink       | period: string, text: string, opts: any | TemplateResult | Renders a link for a specific time frame option. |
| renderDropDownContent | -                      | TemplateResult \| typeof nothing | Renders the content of the dropdown based on the current mode. |
| renderPicker     | -                            | TemplateResult | Renders the date picker component.                                        |
| render           | -                            | TemplateResult | Renders the component's template.                                         |

## Events (if any)

- **No custom events are emitted by this component.**

## Examples

```typescript
// Example usage of the PlausibleDatePicker component
const datePicker = document.createElement('pl-date-picker');
datePicker.history = new BrowserHistory();
document.body.appendChild(datePicker);
```

Note: The example above assumes that the `BrowserHistory` class and other necessary dependencies are already imported and available in the context where the `PlausibleDatePicker` component is being used.