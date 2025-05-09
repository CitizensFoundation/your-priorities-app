# Service: EmailWorker

The `EmailWorker` service is responsible for sending emails within the application. It provides a method to send a single email using the underlying email utility module. This service is typically used by controllers or other services that need to trigger email notifications.

## Methods

| Name     | Parameters                                      | Return Type | Description                                      |
|----------|-------------------------------------------------|-------------|--------------------------------------------------|
| sendOne  | emailLocals: object, callback: (error?: any) => void | void        | Sends a single email using provided template data.|

---

## Method: EmailWorker.sendOne

Sends a single email using the provided template locals. Delegates the actual sending to the [`sendOneEmail`](./engine/notifications/emails_utils.md) function from the email utilities module.

### Parameters

| Name        | Type                          | Description                                      |
|-------------|-------------------------------|--------------------------------------------------|
| emailLocals | object                        | Locals for the email template.                   |
| callback    | (error?: any) => void         | Callback function to handle completion or error.  |

### Usage Example

```javascript
const emailWorker = require('./path/to/EmailWorker.cjs');

emailWorker.sendOne(
  {
    to: 'user@example.com',
    subject: 'Welcome!',
    body: 'Hello, welcome to our service!'
  },
  function (err) {
    if (err) {
      console.error('Failed to send email:', err);
    } else {
      console.log('Email sent successfully!');
    }
  }
);
```

---

# Exported Instance

The module exports a singleton instance of `EmailWorker`:

```javascript
/** @type {EmailWorker} */
module.exports = new EmailWorker();
```

---

# Dependencies

- [`logger`](../utils/logger.md): Used for logging (imported but not directly used in this file).
- [`sendOneEmail`](./engine/notifications/emails_utils.md): The utility function that actually sends the email.

---

# See Also

- [emails_utils.cjs](./engine/notifications/emails_utils.md) — for the underlying email sending logic.
- [logger.cjs](../utils/logger.md) — for logging utilities.