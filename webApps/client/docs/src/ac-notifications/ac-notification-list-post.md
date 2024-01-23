# AcNotificationListPost

A custom element that displays a notification list item for a post, including endorsements and oppositions.

## Properties

| Name              | Type                     | Description                                                                 |
|-------------------|--------------------------|-----------------------------------------------------------------------------|
| notification      | AcNotificationData       | The notification data associated with the post.                             |
| endorsementsText  | string                   | Text representing the endorsements of the post.                             |
| oppositionsText   | string                   | Text representing the oppositions of the post.                              |
| newPostMode       | boolean                  | Flag indicating if the notification is for a new post.                      |
| endorseMode       | boolean                  | Flag indicating if the notification is for an endorsement.                  |
| userName          | string                   | The name of the user associated with the notification.                      |
| user              | YpUserData               | The user data associated with the notification.                             |
| post              | YpPostData               | The post data associated with the notification.                            |

## Methods

| Name                | Parameters               | Return Type | Description                                                                 |
|---------------------|--------------------------|-------------|-----------------------------------------------------------------------------|
| updated             | changedProperties: Map   | void        | Lifecycle method called after the element’s properties have been updated.   |
| render              | -                        | TemplateResult | Renders the element template.                                              |
| _goToPost           | -                        | void        | Navigates to the post associated with the notification.                     |
| _notificationChanged| -                        | void        | Processes changes to the notification property.                             |
| _createEndorsementStrings | -                  | void        | Creates strings for endorsements and oppositions based on notification data.|
| _addWithComma       | text: string, toAdd: string | string   | Adds a name to a comma-separated list.                                      |

## Events

- **yp-close-right-drawer**: Emitted when the right drawer should be closed after navigating to a post.

## Examples

```typescript
// Example usage of the AcNotificationListPost element
<ac-notification-list-post
  .notification="${this.notification}"
  .endorsementsText="${this.endorsementsText}"
  .oppositionsText="${this.oppositionsText}"
  .newPostMode="${this.newPostMode}"
  .endorseMode="${this.endorseMode}"
  .userName="${this.userName}"
  .user="${this.user}"
  .post="${this.post}"
></ac-notification-list-post>
```

Please note that the actual usage may vary depending on the context within which the element is used, and the example above assumes that the properties are set with the appropriate data types.