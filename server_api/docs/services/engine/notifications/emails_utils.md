# Service Module: emailWorker

This module provides core email notification delivery logic for the application, including filtering notifications for delivery, rendering email templates, and sending emails via various SMTP providers (SendGrid, Gmail, custom SMTP). It also handles localization, template rendering, and suppression of duplicate notifications using Redis.

## Configuration

The module's behavior is controlled by several environment variables:

| Name                                 | Type   | Description                                                                                 |
|-------------------------------------- |--------|---------------------------------------------------------------------------------------------|
| SENDGRID_API_KEY                      | string | If set, uses SendGrid SMTP for email delivery.                                              |
| GMAIL_ADDRESS, GMAIL_CLIENT_ID, GMAIL_PRIVATE_KEY | string | If set, uses Gmail OAuth2 for email delivery.                                               |
| SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, SMTP_ACCEPT_INVALID_CERT | string | If set, uses custom SMTP server for email delivery.                                         |
| EMAIL_CONFIG_FROM_ADDRESS, EMAIL_CONFIG_FROM_NAME, EMAIL_CONFIG_URL | string | Used for setting sender details in emails.                                                  |
| EMAIL_CONFIG_340_X_74_BANNER_IMAGE_URL| string | Optional banner image for emails.                                                           |
| EMAIL_FROM                            | string | Fallback sender email address.                                                              |
| ADMIN_EMAIL_BCC                       | string | Optional BCC address for outgoing emails.                                                   |
| DEFAULT_HOSTNAME                      | string | Default hostname for community context.                                                     |
| AIRBRAKE_PROJECT_ID                   | string | If set, enables Airbrake error reporting.                                                   |

## Exported Functions

| Name                           | Parameters                                                                 | Return Type | Description                                                                                 |
|---------------------------------|----------------------------------------------------------------------------|-------------|---------------------------------------------------------------------------------------------|
| filterNotificationForDelivery   | notification: object, user: object, template: string, subject: string \| object, callback: function | void        | Filters and processes a notification for delivery, applying group admin and suppression logic.|
| sendOneEmail                    | emailLocals: object, callback: function                                   | void        | Renders and sends a single email using the configured transport and template.                |

---

# Service: filterNotificationForDelivery

Filters a notification for delivery to a user, applying group admin checks and suppression logic to avoid duplicate or unnecessary emails.

## Parameters

| Name         | Type    | Description                                                                                 |
|--------------|---------|---------------------------------------------------------------------------------------------|
| notification | object  | The notification object, including activities and context.                                  |
| user         | object  | The user object, including notification settings and email.                                 |
| template     | string  | The name of the email template to use.                                                      |
| subject      | string \| object | The subject or subject translation token for the email.                                 |
| callback     | function| Callback function to be called after processing (error-first signature).                    |

## Description

- If the template is `"point_activity"`, checks if the user is a group admin before sending.
- Uses Redis to suppress duplicate emails within a time window.
- Delegates to `processNotification` for actual queuing or suppression.

---

# Service: sendOneEmail

Renders and sends a single email to a user using the configured SMTP transport and EJS templates.

## Parameters

| Name        | Type    | Description                                                                                 |
|-------------|---------|---------------------------------------------------------------------------------------------|
| emailLocals | object  | Local variables for the email template, including user, domain, subject, etc.               |
| callback    | function| Callback function to be called after sending (error-first signature).                       |

## Description

- Determines sender, reply-to, and community context based on domain and environment.
- Sets up localization (i18n) for the email.
- Renders both HTML and text versions of the email using EJS templates.
- Sends the email using the configured transport (SendGrid, Gmail, or custom SMTP).
- Handles error logging and Airbrake reporting if enabled.
- If no transport is configured and `DEBUG_EMAILS_TO_TEMP_FIlE` is true, writes the email to a temp file for debugging.

---

# Utility Function: renderTemplateWithLocals

Renders both HTML and text EJS templates for an email with the provided local variables.

## Parameters

| Name         | Type    | Description                                                                                 |
|--------------|---------|---------------------------------------------------------------------------------------------|
| templatePath | string  | Path to the template directory (should contain `html.ejs` and `text.ejs`).                  |
| locals       | object  | Local variables to pass to the EJS templates.                                               |
| done         | function| Callback function with signature (error, { html, text }).                                   |

## Description

- Renders `html.ejs` and `text.ejs` in parallel.
- Returns the rendered HTML and text content.

---

# Utility Function: translateSubject

Translates the subject for the email using i18n.

## Parameters

| Name         | Type    | Description                                                                                 |
|--------------|---------|---------------------------------------------------------------------------------------------|
| subjectHash  | string \| object | If string, used as translation token. If object, uses `translateToken` and appends `contentName` if present. |

## Returns

- `string`: The translated subject line.

---

# Utility Function: linkTo

Generates an HTML anchor tag for a given URL.

## Parameters

| Name | Type   | Description         |
|------|--------|---------------------|
| url  | string | The URL to link to. |

## Returns

- `string`: HTML anchor tag.

---

# Exported Constants

| Name                      | Type    | Description                                                                                 |
|---------------------------|---------|---------------------------------------------------------------------------------------------|
| LIMIT_EMAILS_FOR_SECONDS  | number  | Number of seconds to suppress duplicate emails (default: 3600 seconds = 1 hour).            |
| SUPPRESSION_KEYBASE       | string  | Redis key prefix for email suppression.                                                     |

---

# Internal Dependencies

- [../../utils/logger.cjs](../../utils/logger.cjs): Logging utility.
- [../../utils/i18n.cjs](../../utils/i18n.cjs): Internationalization utility.
- [../../utils/redisConnection.cjs](../../utils/redisConnection.cjs): Redis connection for suppression.
- [../../workers/queue.cjs](../../workers/queue.cjs): Job queue for sending emails.
- [../../../models/index.cjs](../../../models/index.cjs): Data models, including `AcNotification`.
- [../../utils/airbrake.cjs](../../utils/airbrake.cjs): Airbrake error reporting (optional).

---

# Example Usage

```javascript
const emailWorker = require('./path/to/emailWorker.cjs');

// Filtering and queuing a notification for delivery
emailWorker.filterNotificationForDelivery(notification, user, 'point_activity', 'New Point', (err) => {
  if (err) {
    console.error('Failed to process notification:', err);
  }
});

// Sending a single email directly
emailWorker.sendOneEmail({
  user: { email: 'user@example.com', id: 1, default_locale: 'en' },
  domain: { domain_name: 'example.com' },
  template: 'welcome',
  subject: 'Welcome to the platform!'
}, (err) => {
  if (err) {
    console.error('Failed to send email:', err);
  }
});
```

---

# Related Modules

- [logger.cjs](../../utils/logger.cjs)
- [i18n.cjs](../../utils/i18n.cjs)
- [redisConnection.cjs](../../utils/redisConnection.cjs)
- [queue.cjs](../../workers/queue.cjs)
- [models/index.cjs](../../../models/index.cjs)
- [airbrake.cjs](../../utils/airbrake.cjs)

---

# Notes

- The module is designed to be robust and configurable for different deployment environments.
- Email suppression is implemented using Redis to avoid spamming users.
- Template rendering supports localization and custom formatting helpers.
- The module is not an Express route handler but is intended to be used by background workers or service layers.