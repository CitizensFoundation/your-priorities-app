# Utility Function: createOrGetAnonymousUser

This utility function ensures that a system-level anonymous user exists in the database. It attempts to find a user with a specific email address (system.anonymous.user72@citizens.is). If such a user does not exist, it creates one with predefined default values. The function is asynchronous and uses a callback to return either the user object or an error.

## Parameters

| Name     | Type       | Description                                                                 |
|----------|------------|-----------------------------------------------------------------------------|
| callback | Function   | A Node.js-style callback function: (error: Error \| null, user: User) => void |

## Behavior

- Uses the [User](../../models/index.cjs) model to find or create a user with the email system.anonymous.user72@citizens.is.
- If the user does not exist, creates a new user with:
  - `profile_data`: `{ isAnonymousUser: true }`
  - `email`: `"system.anonymous.user72@citizens.is"`
  - `name`: `"Anonymous"`
  - `notifications_settings`: Uses the default anonymous notification settings from the [AcNotification](../../models/index.cjs) model.
  - `status`: `"active"`
- Invokes the callback with `(null, user)` on success, or `(error)` on failure.

## Example Usage

```javascript
const createOrGetAnonymousUser = require('./path/to/this/module');

createOrGetAnonymousUser((err, user) => {
  if (err) {
    console.error('Failed to get or create anonymous user:', err);
  } else {
    console.log('Anonymous user:', user);
  }
});
```

## Dependencies

- [models.User](../../models/index.cjs): The User model, used for querying and creating users.
- [models.AcNotification.anonymousNotificationSettings](../../models/index.cjs): Default notification settings for anonymous users.

## Exported

This module exports a single function as described above.

---

**See also:**  
- [User Model](../../models/index.cjs)  
- [AcNotification Model](../../models/index.cjs)