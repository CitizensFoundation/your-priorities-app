# YpOffline

The `YpOffline` class extends `YpCodeBase` and provides functionality to handle offline and online events, manage content to be sent later when the user is offline, and send it when the user is back online.

## Properties

| Name                    | Type   | Description                                      |
|-------------------------|--------|--------------------------------------------------|
| sendLaterStoragePrefix  | string | Prefix used for keys in localStorage for storing content to be sent later. |

## Methods

| Name                          | Parameters                                      | Return Type | Description                                                                 |
|-------------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| _onlineEvent                  | -                                               | void        | Handles the online event, shows a toast message, and checks for content to send. |
| _offlineEvent                 | -                                               | void        | Handles the offline event and shows a toast message.                        |
| _urlWithQuery                 | url: string, params: any                        | string      | Constructs a URL with query parameters from the given object.               |
| _getItemsFromLocalStorage     | -                                               | YpLocaleStorageItemToSendLater[] | Retrieves items from localStorage that are marked to be sent later.         |
| _sendItems                    | items: YpLocaleStorageItemToSendLater[]         | void        | Sends the stored items to their respective URLs and removes them from localStorage upon success. |
| _checkContentToSend           | -                                               | void        | Checks if there is content to send and attempts to send it if conditions are met. |
| checkContentToSendForLoggedInUser | -                                           | void        | Public method to check and send content for a logged-in user.               |
| sendWhenOnlineNext            | contentToSendLater: YpContentToSendLater        | void        | Stores content to be sent later when the user is online.                    |
| constructor                   | -                                               | -           | Initializes the class, sets up event listeners for online/offline events, and checks for content to send. |

## Examples

```typescript
// Example usage of the YpOffline class
const ypOffline = new YpOffline();

// To store content to be sent later
ypOffline.sendWhenOnlineNext({
  url: 'https://example.com/api/data',
  method: 'POST',
  body: { key: 'value' }
});

// To manually check and send content for a logged-in user
ypOffline.checkContentToSendForLoggedInUser();
```

## Events

- **online**: Triggered when the browser goes online, prompting the class to attempt sending stored content.
- **offline**: Triggered when the browser goes offline, notifying the user of the offline status.