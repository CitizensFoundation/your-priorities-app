# YpDrawer

A custom drawer component that extends `YpBaseElement` and provides a sliding drawer functionality with customizable position and scrim transparency.

## Properties

| Name              | Type                      | Description                                                                 |
|-------------------|---------------------------|-----------------------------------------------------------------------------|
| open              | boolean \| undefined      | Indicates whether the drawer is open. Reflects the attribute to the DOM.    |
| position          | "left" \| "right"         | Specifies the position of the drawer, either "left" or "right". Defaults to "left". |
| transparentScrim  | boolean                   | Determines if the scrim (overlay) is transparent. Defaults to `true`.       |

## Methods

| Name                | Parameters                                      | Return Type | Description                                                                 |
|---------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback   | None                                            | void        | Lifecycle method called when the element is added to the document. Sets up event listeners. |
| disconnectedCallback| None                                            | void        | Lifecycle method called when the element is removed from the document. Cleans up event listeners. |
| _closeAllDrawers    | None                                            | void        | Closes the drawer by setting `open` to `false`.                            |
| updated             | changedProperties: Map<string \| number \| symbol, unknown> | void        | Called when properties change. Fires "opened" or "closed" events based on the `open` property. |
| _handleScrimClick   | event: MouseEvent                               | void        | Handles clicks on the scrim to close the drawer if clicked.                |
| _handleEscKey       | event: KeyboardEvent                            | void        | Closes the drawer when the Escape key is pressed.                          |
| render              | None                                            | TemplateResult | Renders the drawer and scrim elements.                                      |

## Events

- **opened**: Emitted when the drawer is opened.
- **closed**: Emitted when the drawer is closed.

## Examples

```typescript
// Example usage of the yp-drawer component
import './path/to/yp-drawer.js';

const drawer = document.createElement('yp-drawer');
drawer.open = true;
drawer.position = 'right';
drawer.transparentScrim = false;
document.body.appendChild(drawer);

drawer.addEventListener('opened', () => {
  console.log('Drawer opened');
});

drawer.addEventListener('closed', () => {
  console.log('Drawer closed');
});
```