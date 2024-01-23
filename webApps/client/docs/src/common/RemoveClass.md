# removeClass

Removes a specified class from an HTML element's class list.

## Properties

This function does not have properties.

## Methods

| Name         | Parameters                        | Return Type | Description                                      |
|--------------|-----------------------------------|-------------|--------------------------------------------------|
| removeClass  | element: HTMLElement, classToRemove: string | void        | Removes the specified class from the element's class list. |

## Examples

```typescript
// Example usage of removeClass function
const element = document.getElementById('myElement');
removeClass(element, 'myClassToRemove');
```

This function does not emit any events.