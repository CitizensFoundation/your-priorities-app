# PlausibleConversions

`PlausibleConversions` is a custom web component that extends `PlausibleBaseElementWithState` to display conversion data for different goals. It fetches and renders goal conversion statistics, including unique conversions, total conversions, and conversion rates. The component is responsive and adjusts its layout and data presentation based on the viewport size.

## Properties

| Name              | Type                          | Description                                           |
|-------------------|-------------------------------|-------------------------------------------------------|
| onClickFunction   | any                           | Function to be executed on click events.              |
| loading           | boolean                       | Indicates whether the component is in a loading state.|
| viewport          | number                        | The width of the viewport for responsive design.      |
| prevHeight        | number \| undefined           | The previous height of the component.                 |
| goals             | PlausibleGoalData[] \| undefined | Array of goal data to be displayed.                  |
| highlightedGoals  | string[] \| undefined         | Array of goal names that should be highlighted.       |

## Methods

| Name              | Parameters                   | Return Type | Description                                      |
|-------------------|------------------------------|-------------|--------------------------------------------------|
| handleResize      | -                            | void        | Handles the resize event and updates the viewport.|
| fetchConversions  | -                            | void        | Fetches conversion data from the API.            |
| getBarMaxWidth    | -                            | string      | Returns the maximum width for the bar elements.  |
| getPlBackground   | goalName: string             | string      | Returns the background class for a given goal.   |
| renderGoal        | goal: PlausibleGoalData      | unknown     | Renders a single goal's conversion data.         |
| renderInner       | -                            | unknown     | Renders the inner content of the component.      |
| render            | -                            | unknown     | Renders the component.                           |

## Events

- **resize**: Emitted when the window is resized to adjust the component's layout.
- **api-call**: Emitted when the component makes an API call to fetch conversion data.

## Examples

```typescript
// Example usage of the PlausibleConversions component
<pl-conversions
  .onClickFunction=${someClickHandler}
  .loading=${false}
  .viewport=${1080}
  .goals=${[/* array of PlausibleGoalData */]}
  .highlightedGoals=${["goal1", "goal2"]}
></pl-conversions>
```

Note: `PlausibleGoalData` is a type that should be defined elsewhere in the codebase, containing the structure of the goal data expected by the component.