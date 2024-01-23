# YpBaseElementWithLogin

This class extends `YpBaseElement` to include functionality related to user login status.

## Properties

| Name         | Type            | Description                           |
|--------------|-----------------|---------------------------------------|
| loggedInUser | YpUserData\|undefined | The data of the user if logged in. |

## Methods

| Name                  | Parameters        | Return Type | Description                                         |
|-----------------------|-------------------|-------------|-----------------------------------------------------|
| connectedCallback     |                   | void        | Sets up event listeners when the element is added to the DOM. |
| disconnectedCallback  |                   | void        | Cleans up event listeners when the element is removed from the DOM. |
| isLoggedIn            |                   | boolean     | Returns true if a user is logged in, otherwise false. |
| _loggedIn             | event: CustomEvent | void        | Updates the `loggedInUser` property when a user logs in. |

## Events

- **yp-logged-in**: Emitted when a user logs in.
- **yp-got-admin-rights**: Emitted when a user gets admin rights.

## Examples

```typescript
// Example usage of YpBaseElementWithLogin
class YpUserData {
  // User data structure
}

// Assuming `window.appUser.user` is available and contains user data
const ypBaseElementWithLogin = new YpBaseElementWithLogin();

// To check if a user is logged in
if (ypBaseElementWithLogin.isLoggedIn) {
  console.log('User is logged in:', ypBaseElementWithLogin.loggedInUser);
}

// Listening to the yp-logged-in event
window.addEventListener('yp-logged-in', (event) => {
  console.log('User logged in:', event.detail);
});

// Listening to the yp-got-admin-rights event
window.addEventListener('yp-got-admin-rights', () => {
  console.log('User got admin rights');
});
```
