# Service Module: Worker Queue Initializer (`index.cjs`)

This module initializes the i18n (internationalization) system and sets up a series of background job processors using a queue system. Each processor is responsible for handling a specific type of background task, such as sending emails, processing notifications, handling moderation, and more. The module also dynamically imports and initializes a generative AI worker for AI-related background jobs.

---

## Initialization Flow

1. **i18n Setup**:  
   Initializes the i18n internationalization system with multiple supported languages and a file-system backend for loading translation files.

2. **Queue Processors Registration**:  
   Registers multiple job processors with the queue, each mapped to a specific job type and concurrency level.

3. **Dynamic Import**:  
   Dynamically imports and initializes the Generative AI worker for handling AI-related jobs.

---

## Dependencies

- [i18n](../utils/i18n.cjs): Internationalization utility.
- [i18next-fs-backend](https://github.com/i18next/i18next-fs-backend): Backend for loading translations from the filesystem.
- [logger](../utils/logger.cjs): Logging utility.
- [queue](./queue.cjs): Job queue system (likely based on Kue, Bull, or similar).
- Various job handler modules (see below).

---

## Configuration

### i18n Initialization

| Option         | Type     | Description                                                                 |
|----------------|----------|-----------------------------------------------------------------------------|
| preload        | string[] | List of language codes to preload.                                          |
| fallbackLng    | string   | Fallback language code.                                                     |
| lowerCaseLng   | boolean  | Whether to use lower-case language codes.                                   |
| backend        | object   | Backend configuration for loading and saving translation files.              |
| backend.loadPath | string | Path template for loading translation files.                                |
| backend.addPath | string  | Path template for saving missing translation keys.                          |
| backend.jsonIndent | number | Indentation for saved JSON files.                                         |

---

## Registered Queue Processors

Each processor listens for a specific job type and delegates processing to the corresponding module.

| Job Type                        | Concurrency | Handler Module                       | Handler Function         | Description                                      |
|----------------------------------|-------------|--------------------------------------|-------------------------|--------------------------------------------------|
| send-one-email                   | 20          | [email](./email.cjs)                 | sendOne                 | Sends a single email.                            |
| process-notification-delivery    | 25          | [notification_delivery](./notification_delivery.cjs) | process | Delivers notifications to users.                 |
| process-activity                 | 10          | [activity](./activity.cjs)           | process                 | Processes user or system activities.             |
| delayed-job                      | 15          | [delayedJobs](./delayed_jobs.cjs)    | process                 | Handles delayed jobs.                            |
| process-notification-news-feed   | 10          | [notification_news_feed](./notification_news_feed.cjs) | process | Updates the notification news feed.              |
| process-bulk-status-update       | 1           | [bulk_status_update](./bulk_status_update.cjs) | process | Performs bulk status updates.                    |
| process-deletion                 | 5           | [deletions](./deletions.cjs)         | process                 | Handles deletion jobs.                           |
| process-anonymization            | 5           | [anonymizations](./anonymizations.cjs) | process                | Handles data anonymization.                      |
| process-voice-to-text            | 1           | [speechToText](./speech_to_text.cjs) | process                 | Converts voice to text.                          |
| process-moderation               | 1           | [moderation](./moderation.cjs)       | process                 | Handles content moderation.                      |
| process-similarities             | 1           | [similarities](./similarities.cjs)   | process                 | Processes similarity checks.                     |
| process-fraud-action             | 2           | [fraudManagement](./fraud_management.cjs) | process              | Handles fraud management actions.                |
| process-reports                  | 1           | [reports](./reports.cjs)             | process                 | Processes user or system reports.                |
| process-marketing                | 20          | [marketing](./marketing.cjs)         | process                 | Handles marketing-related jobs.                  |
| process-generative-ai            | 1           | [GenerativeAiWorker](./generativeAi.js) | process              | Handles generative AI jobs (dynamically imported).|

---

## Dynamic Import

### Generative AI Worker

- **Module**: `./generativeAi.js`
- **Exported Class**: `GenerativeAiWorker`
- **Queue Job**: `process-generative-ai`
- **Concurrency**: 1

**Description**:  
Dynamically imports the `GenerativeAiWorker` class and registers it as a queue processor for generative AI jobs.

---

## Example: Registering a Queue Processor

```javascript
queue.process('send-one-email', 20, function(job, done) {
  email.sendOne(job.data, done);
});
```

- **Job Type**: `send-one-email`
- **Concurrency**: 20
- **Handler**: `email.sendOne(job.data, done)`

---

## Logging

- Logs the current directory at startup.
- Logs the result of i18n initialization.

---

## Exported Constants

None. This module is intended for side-effect initialization only.

---

## Related Modules

- [i18n Utility](../utils/i18n.cjs)
- [Logger Utility](../utils/logger.cjs)
- [Queue System](./queue.cjs)
- [Email Handler](./email.cjs)
- [Notification Delivery Handler](./notification_delivery.cjs)
- [Activity Handler](./activity.cjs)
- [Delayed Jobs Handler](./delayed_jobs.cjs)
- [Notification News Feed Handler](./notification_news_feed.cjs)
- [Bulk Status Update Handler](./bulk_status_update.cjs)
- [Deletions Handler](./deletions.cjs)
- [Anonymizations Handler](./anonymizations.cjs)
- [Moderation Handler](./moderation.cjs)
- [Speech to Text Handler](./speech_to_text.cjs)
- [Similarities Handler](./similarities.cjs)
- [Reports Handler](./reports.cjs)
- [Marketing Handler](./marketing.cjs)
- [Fraud Management Handler](./fraud_management.cjs)
- [Generative AI Worker](./generativeAi.js)

---

## Usage

This file is typically run as part of the application's background worker process. It should not be imported as a module, but rather executed to initialize all background job processors and i18n support.

---

## See Also

- [i18n Utility Documentation](../utils/i18n.md)
- [Queue System Documentation](./queue.md)
- [Generative AI Worker](./generativeAi.md)
- [Email Handler](./email.md)
- [Notification Delivery Handler](./notification_delivery.md)
- [Activity Handler](./activity.md)
- [Moderation Handler](./moderation.md)
- [Fraud Management Handler](./fraud_management.md)
- [Reports Handler](./reports.md)
- [Marketing Handler](./marketing.md)
- [Speech to Text Handler](./speech_to_text.md)
- [Similarities Handler](./similarities.md)
- [Bulk Status Update Handler](./bulk_status_update.md)
- [Deletions Handler](./deletions.md)
- [Anonymizations Handler](./anonymizations.md)
- [Notification News Feed Handler](./notification_news_feed.md)

---

**Note:**  
Each handler module (e.g., `email`, `activity`, `moderation`) should be documented separately for details on their `process` or `sendOne` methods and expected job data formats.