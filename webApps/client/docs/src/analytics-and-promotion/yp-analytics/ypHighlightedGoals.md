# highlightedGoals

An array of string constants representing various user interaction events within an application.

## Properties

Not applicable for array constants.

## Methods

Not applicable for array constants.

## Events

Not applicable for array constants.

## Examples

```typescript
// Example usage of the highlightedGoals array
const userAction = "newPost - completed";

if (highlightedGoals.includes(userAction)) {
  console.log("This user action is a highlighted goal.");
} else {
  console.log("This user action is not a highlighted goal.");
}
```