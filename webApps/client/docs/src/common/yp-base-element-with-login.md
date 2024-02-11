# YpBaseElementWithLogin

This class extends `YpBaseElement` to provide functionality related to user login status.

## Properties

| Name         | Type            | Description                           |
|--------------|-----------------|---------------------------------------|
| loggedInUser | YpUserData\|undefined | The data of the logged-in user, if any. |

## Methods

| Name                  | Parameters        | Return Type | Description                                         |
|-----------------------|-------------------|-------------|-----------------------------------------------------|
| constructor           |                   |             | Initializes the component and sets the logged-in user if available. |
| connectedCallback     |                   |             | Sets up event listeners when the element is added to the DOM. |
| disconnectedCallback  |                   |             | Cleans up event listeners when the element is removed from the DOM. |
| isLoggedIn            |                   | boolean     | Returns true if a user is logged in, false otherwise. |
| _loggedIn             | event: CustomEvent | void        | Updates the `loggedInUser` property when a user logs in. |

## Events

- **yp-logged-in**: Emitted when a user logs in. The `loggedInUser` property is updated in response to this event.
- **yp-got-admin-rights**: Emitted when a user gets admin rights. Triggers a request to update the component.

## Examples

```typescript
// Example usage of YpBaseElementWithLogin
class YpUserData {
  // User data structure (example)
}

// Assuming `window.appUser.user` is available and contains user data
const ypBaseElementWithLogin = new YpBaseElementWithLogin();

// To check if a user is logged in
if (ypBaseElementWithLogin.isLoggedIn) {
  console.log('User is logged in:', ypBaseElementWithLogin.loggedInUser);
}

// Listen for login events
window.addEventListener('yp-logged-in', (event) => {
  console.log('User logged in:', event.detail);
});

// Listen for admin rights events
window.addEventListener('yp-got-admin-rights', () => {
  console.log('User got admin rights');
});
```

Note: The actual implementation of `YpUserData` and the handling of `window.appUser.user` should be provided for the example to be fully functional.