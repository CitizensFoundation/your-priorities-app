# YpLoginWidget

The `YpLoginWidget` is a web component that provides a user interface for login functionality. It extends the `YpBaseElementWithLogin` class and displays different content based on the user's login status.

## Properties

| Name       | Type | Description |
|------------|------|-------------|
| isLoggedIn | boolean | A property inherited from `YpBaseElementWithLogin` that indicates whether the user is currently logged in. |

## Methods

| Name   | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| render | None       | TemplateResult | Overrides the `render` method to provide the component's HTML structure based on the login state. |

## Examples

```typescript
// Example usage of the yp-login-widget component
import './path/to/yp-login-widget.js';

const loginWidget = document.createElement('yp-login-widget');
document.body.appendChild(loginWidget);
```

This component uses the `yp-login` element to handle the login interface when the user is not logged in. When the user is logged in, it displays a message indicating the login status. The styles are defined to ensure a consistent look and feel, with specific dimensions and typography settings.