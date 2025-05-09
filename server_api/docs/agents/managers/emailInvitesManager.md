# Service: AgentInviteManager

The `AgentInviteManager` service is responsible for sending notification emails to group admins regarding the current workflow step or completion of an agent product run. It composes the email content using a template renderer, gathers necessary data from the database, and enqueues the email for sending via a background worker queue.

---

## Methods

| Name            | Parameters                                                                                                                                                                                                 | Return Type | Description                                                                                      |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|--------------------------------------------------------------------------------------------------|
| sendInviteEmail | link: `string`, agentRunId: `number`, groupId: `number`, senderUser: `UserClass`, inviteeEmail: `string`                                                                                                   | `Promise<void>` | Sends a notification email to a group admin about an agent workflow step or completion.           |

---

## Method: AgentInviteManager.sendInviteEmail

Sends a notification email to a group admin about the current workflow step or completion of an agent product run. The email is rendered using a template and enqueued for delivery via a background worker.

### Parameters

| Name         | Type        | Description                                                                                 |
|--------------|-------------|---------------------------------------------------------------------------------------------|
| link         | `string`    | The URL link to be included in the email (e.g., invitation or workflow link).              |
| agentRunId   | `number`    | The ID of the agent product run (YpAgentProductRun) for which the notification is sent.    |
| groupId      | `number`    | The ID of the group whose admins will receive the notification.                            |
| senderUser   | `UserClass` | The user object representing the sender (typically the inviter).                           |
| inviteeEmail | `string`    | The email address of the invitee (recipient of the notification).                          |

### Description

- Retrieves the agent run details using `NotificationAgentQueueManager.getAgentRun`.
- Composes the email subject based on the agent product and workflow step.
- Fetches group, community, and domain information from the database.
- Renders the email content using `EmailTemplateRenderer.renderEmail`.
- Enqueues the email for sending using the `queue` worker service.
- Handles errors and logs relevant information.

### Example Usage

```typescript
await AgentInviteManager.sendInviteEmail(
  "https://example.com/invite/abc123",
  42,
  7,
  senderUser,
  "invitee@example.com"
);
```

---

## Dependencies

- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts): Used for agent data modeling.
- [YpAgentProductRun](./../models/agentProductRun.md): Represents the agent product run entity.
- `models` (imported from `../../models/index.cjs`): Provides access to ORM models such as Group, User, Community, and Domain.
- [EmailTemplateRenderer](./emailTemplateRenderer.md): Used to render the email content.
- `queue` (imported from `../../services/workers/queue.cjs`): Background worker queue for sending emails.
- [NotificationAgentQueueManager](./notificationAgentQueueManager.md): Used to fetch agent run details.

---

## Related Models

### YpGroupData

The group data object returned from the ORM query, which includes:

| Name      | Type         | Description                                 |
|-----------|--------------|---------------------------------------------|
| Community | `CommunityClass` | The community associated with the group.   |
| ...       | ...          | Other group properties as defined in the model. |

---

## Example Email Payload Enqueued

```json
{
  "subject": "AgentProductName - StepName invite",
  "template": "general_user_notification",
  "user": { "id": null, "email": "invitee@example.com", "name": "invitee@example.com" },
  "domain": { /* Domain object */ },
  "group": { /* Group object */ },
  "object": {},
  "header": "",
  "content": "<rendered HTML content>",
  "link": "https://example.com/invite/abc123",
  "skipHeaderAndFooter": true
}
```

---

## Error Handling

- Logs errors to the console if the agent run is not found or if any step fails.
- Throws the error after logging for upstream handling.

---

## See Also

- [EmailTemplateRenderer](./emailTemplateRenderer.md)
- [NotificationAgentQueueManager](./notificationAgentQueueManager.md)
- [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts)
- [YpAgentProductRun](./../models/agentProductRun.md)