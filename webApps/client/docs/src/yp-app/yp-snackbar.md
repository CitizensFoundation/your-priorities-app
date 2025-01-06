# YpSnackbar

A custom snackbar component that displays brief messages at the bottom of the screen. It can be configured to automatically close after a specified duration.

## Properties

| Name       | Type    | Description                                                                 |
|------------|---------|-----------------------------------------------------------------------------|
| open       | Boolean | Indicates whether the snackbar is open and visible.                         |
| labelText  | String  | The text message to be displayed in the snackbar.                           |
| timeoutMs  | Number  | The duration in milliseconds for which the snackbar remains visible. Default is 5000 ms. |

## Methods

| Name          | Parameters | Return Type | Description                                                                 |
|---------------|------------|-------------|-----------------------------------------------------------------------------|
| showSnackbar  | None       | void        | Displays the snackbar and automatically closes it after `timeoutMs` duration. |
| closeSnackbar | None       | void        | Closes the snackbar immediately and dispatches a "closed" event.             |

## Events

- **closed**: Emitted when the snackbar is closed either automatically after the timeout or manually.

## Examples

```typescript
// Example usage of the yp-snackbar component
const snackbar = document.createElement('yp-snackbar');
snackbar.labelText = 'This is a snackbar message';
snackbar.open = true;
document.body.appendChild(snackbar);

// To manually close the snackbar
snackbar.closeSnackbar();
```