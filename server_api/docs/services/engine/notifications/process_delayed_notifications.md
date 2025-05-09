# Utility Module: delayed_notifications.cjs

This module handles the processing and sending of delayed notification emails to users based on their notification frequency (hourly, daily, weekly, monthly). It aggregates notifications, formats email content, sets localization, and dispatches emails using the provided email utility. The module interacts with various models (such as `AcDelayedNotification`, `AcNotification`, `AcActivity`, etc.) and uses i18n for localization.

---

## Exported Functions

This module does not export functions directly; it is intended to be run as a script or required for its side effects (processing delayed notifications).

---

## Main Notification Processing Functions

### sendNotificationEmail

Processes a batch of delayed notifications, aggregates them by domain, community, and group, formats the email content, sets the appropriate language, and sends the email.

#### Parameters

| Name                | Type     | Description                                      |
|---------------------|----------|--------------------------------------------------|
| delayedNotification | object   | The delayed notification object, including user and notifications. |
| callback            | function | Callback to be called after processing.          |

---

### sendNotification

Dispatches the notification to the appropriate handler based on its type.

#### Parameters

| Name         | Type     | Description                                      |
|--------------|----------|--------------------------------------------------|
| notification | object   | The notification object to process.              |
| callback     | function | Callback to be called after processing.          |

---

### getDelayedNotificationToProcess

Fetches all undelivered delayed notifications for a given frequency and processes them.

#### Parameters

| Name      | Type     | Description                                      |
|-----------|----------|--------------------------------------------------|
| frequency | number   | Notification frequency (1: hourly, 2: daily, 3: weekly, 4: monthly). |
| callback  | function | Callback to be called after processing.          |

---

## Notification Type Handlers

Each of these functions logs notification details and iterates over the notification's activities.

### sendPostNew

Handles "post.new" notifications.

#### Parameters

| Name                | Type     | Description                                      |
|---------------------|----------|--------------------------------------------------|
| delayedNotification | object   | The delayed notification object.                 |
| callback            | function | Callback to be called after processing.          |

---

### sendPostEndorsement

Handles "post.endorsement" notifications.

#### Parameters

| Name                | Type     | Description                                      |
|---------------------|----------|--------------------------------------------------|
| delayedNotification | object   | The delayed notification object.                 |
| callback            | function | Callback to be called after processing.          |

---

### sendPointNew

Handles "point.new" notifications.

#### Parameters

| Name                | Type     | Description                                      |
|---------------------|----------|--------------------------------------------------|
| delayedNotification | object   | The delayed notification object.                 |
| callback            | function | Callback to be called after processing.          |

---

### sendPointNewsStory

Handles "point.newsStory" notifications.

#### Parameters

| Name                | Type     | Description                                      |
|---------------------|----------|--------------------------------------------------|
| delayedNotification | object   | The delayed notification object.                 |
| callback            | function | Callback to be called after processing.          |

---

### sendPointComment

Handles "point.comment" notifications.

#### Parameters

| Name                | Type     | Description                                      |
|---------------------|----------|--------------------------------------------------|
| delayedNotification | object   | The delayed notification object.                 |
| callback            | function | Callback to be called after processing.          |

---

## Email Content Formatting Utilities

### formatNameArray

Formats an array of names for display in emails, using Oxford comma rules.

#### Parameters

| Name | Type     | Description                |
|------|----------|----------------------------|
| arr  | string[] | Array of names to format.  |

#### Returns

- `string` — Formatted string of names.

---

### writeHeader

Generates the HTML header for the email.

#### Parameters

| Name       | Type   | Description                |
|------------|--------|----------------------------|
| emailUser  | object | The user receiving the email.|
| headerText | string | The header text.           |

#### Returns

- `string` — HTML string for the header.

---

### writeDomainHeader

Appends a domain header section to the email HTML.

#### Parameters

| Name   | Type   | Description                |
|--------|--------|----------------------------|
| email  | string | Current email HTML.        |
| domain | object | Domain object with image and name. |

#### Returns

- `string` — Updated email HTML.

---

### writeCommunityHeader

Appends a community header section to the email HTML.

#### Parameters

| Name      | Type   | Description                |
|-----------|--------|----------------------------|
| email     | string | Current email HTML.        |
| community | object | Community object with image and name. |

#### Returns

- `string` — Updated email HTML.

---

### writeGroupHeader

Appends a group header section to the email HTML.

#### Parameters

| Name   | Type   | Description                |
|--------|--------|----------------------------|
| email  | string | Current email HTML.        |
| group  | object | Group object with image and name. |

#### Returns

- `string` — Updated email HTML.

---

### writePostHeader

Appends a post header section to the email HTML.

#### Parameters

| Name  | Type   | Description                |
|-------|--------|----------------------------|
| email | string | Current email HTML.        |
| post  | object | Post object with name.     |

#### Returns

- `string` — Updated email HTML.

---

### writePointHeader

Appends a point header section to the email HTML.

#### Parameters

| Name  | Type   | Description                |
|-------|--------|----------------------------|
| email | string | Current email HTML.        |
| point | object | Point object with content. |

#### Returns

- `string` — Updated email HTML.

---

### writePointQualities

Appends point quality information (helpful/unhelpful names) to the email HTML.

#### Parameters

| Name           | Type     | Description                |
|----------------|----------|----------------------------|
| email          | string   | Current email HTML.        |
| helpfulNames   | string[] | Names who found helpful.   |
| unhelpfulNames | string[] | Names who found unhelpful. |

#### Returns

- `string` — Updated email HTML.

---

### writeFooter

Appends the footer to the email HTML.

#### Parameters

| Name      | Type   | Description                |
|-----------|--------|----------------------------|
| email     | string | Current email HTML.        |
| emailUser | object | The user receiving the email. |

#### Returns

- `string` — Updated email HTML.

---

## Email Content Grouping and Processing

These functions group and process notification items for email content.

### processNewPosts

Processes and appends new post notifications to the email.

#### Parameters

| Name       | Type     | Description                |
|------------|----------|----------------------------|
| email      | string   | Current email HTML.        |
| groupItems | object[] | Array of notification items.|

---

### processNewPoints

Processes and appends new point notifications to the email.

#### Parameters

| Name       | Type     | Description                |
|------------|----------|----------------------------|
| email      | string   | Current email HTML.        |
| groupItems | object[] | Array of notification items.|

---

### processPostVotes

Processes and appends post endorsement notifications to the email.

#### Parameters

| Name       | Type     | Description                |
|------------|----------|----------------------------|
| email      | string   | Current email HTML.        |
| groupItems | object[] | Array of notification items.|

---

### processPointVotes

Processes and appends point quality notifications to the email.

#### Parameters

| Name       | Type     | Description                |
|------------|----------|----------------------------|
| email      | string   | Current email HTML.        |
| groupItems | object[] | Array of notification items.|

---

### processNewNewsStories

Processes and appends new news story notifications to the email.

#### Parameters

| Name       | Type     | Description                |
|------------|----------|----------------------------|
| email      | string   | Current email HTML.        |
| groupItems | object[] | Array of notification items.|

---

## Localization Utility

### setLanguage

Sets the language for the email based on user, domain, community, or item preferences.

#### Parameters

| Name                | Type     | Description                                      |
|---------------------|----------|--------------------------------------------------|
| user                | object   | The user object.                                 |
| defaultLocaleObject | object   | Object with a `default_locale` property.         |
| item                | object   | Notification item, may contain Community/Domain. |
| callback            | function | Callback after language is set.                  |

---

## Initialization and Execution

At the end of the file, the module initializes i18n with supported languages and loads translation files. It then processes delayed notifications for each frequency (hourly, daily, weekly, monthly) by calling `getDelayedNotificationToProcess`.

---

## Dependencies

- [models](../../../models/index.cjs): Sequelize models for database access.
- [async](https://caolan.github.io/async/): For asynchronous control flow.
- [lodash](https://lodash.com/): Utility functions for data manipulation.
- [moment](https://momentjs.com/): Date/time manipulation.
- [i18n](../../utils/i18n.cjs): Internationalization utility.
- [i18next-fs-backend](https://github.com/i18next/i18next-fs-backend): Backend for i18n file loading.
- [sendOneEmail](./emails_utils.cjs): Utility for sending emails.
- [logger](../../utils/logger.cjs): Logging utility.

---

## Configuration

### i18n Initialization

- **Supported languages:** `en`, `fr`, `hr`, `is`, `no`, `pl`
- **Fallback language:** `en`
- **Translation files path:** `../../locales/{{lng}}/translation.json`
- **Missing translation path:** `../../locales/{{lng}}/translation.missing.json`

---

## Example Usage

This module is intended to be run as a script (e.g., via a cron job) to process and send delayed notifications. It is not designed for direct function calls from other modules.

---

## Related Modules

- [emails_utils.cjs](./emails_utils.md): For the `sendOneEmail` function.
- [i18n.cjs](../../utils/i18n.md): For localization utilities.
- [logger.cjs](../../utils/logger.md): For logging.
- [models/index.cjs](../../../models/index.md): For Sequelize models.

---

## Notes

- The module relies on the structure of notification and activity objects as defined in the database models.
- Email content is constructed as HTML strings and sent using the `sendOneEmail` utility.
- The module uses a combination of async control flow and lodash for grouping and processing notifications.

---

## See Also

- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts) (for reference to agent models in Policy Synth, if relevant)
