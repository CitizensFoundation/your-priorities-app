# YpIronListHelpers

A utility class providing static methods to attach and detach listeners related to iron-list elements within a given base element.

## Properties

This class does not have properties as it only provides static methods.

## Methods

| Name              | Parameters                          | Return Type | Description                                                                 |
|-------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| attachListeners   | baseElement: YpElementWithIronList  | void        | Attaches a resize listener to the window and initializes the iron list size.|
| detachListeners   | baseElement: YpElementWithIronList  | void        | Detaches the resize listener from the window.                                |

## Examples

```typescript
// Assuming you have a YpElementWithIronList instance named `ypElementWithIronList`
// To attach listeners:
YpIronListHelpers.attachListeners(ypElementWithIronList);

// To detach listeners when they are no longer needed:
YpIronListHelpers.detachListeners(ypElementWithIronList);
```