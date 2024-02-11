# AoiAppGlobals

AoiAppGlobals extends YpAppGlobals to provide global properties and methods specific to the Aoi application.

## Properties

| Name                           | Type                      | Description                                           |
|--------------------------------|---------------------------|-------------------------------------------------------|
| originalQueryParameters        | any                       | Holds the original query parameters from the URL.     |
| originalReferrer               | string                    | The original referrer URL of the document.            |
| questionId                     | number                    | The ID of the current question.                       |
| earlId                         | number                    | The ID associated with the EARL (a specific metric).  |
| promptId                       | number                    | The ID of the current prompt.                         |
| disableParentConstruction      | boolean                   | Flag to disable parent class construction.            |
| exernalGoalParamsWhiteList     | string \| undefined       | Whitelist of parameters for external goal triggers.   |
| externalGoalTriggerUrl         | string \| undefined       | URL to trigger external goals.                        |

## Methods

| Name                   | Parameters                  | Return Type | Description                                                                 |
|------------------------|-----------------------------|-------------|-----------------------------------------------------------------------------|
| constructor            | serverApi: AoiServerApi     | void        | Initializes the class with the server API and sets up event listeners.      |
| setIds                 | e: CustomEvent              | void        | Sets the IDs for question, earl, and prompt from a custom event.            |
| parseQueryString       |                             | void        | Parses the query string from the URL and stores the parameters.             |
| getSessionFromCookie   |                             | string      | Retrieves the session ID from a cookie.                                     |
| getOriginalQueryString |                             | string \| null | Returns the original query string or null if no parameters are present.    |
| activity               | type: string, object: any \| undefined | void | Logs an activity event with various details about the user and action.      |

## Events

- **set-ids**: Emitted to set the IDs for question, earl, and prompt.

## Examples

```typescript
// Example usage of AoiAppGlobals
const serverApi = new AoiServerApi();
const aoiAppGlobals = new AoiAppGlobals(serverApi);

// Listening for a custom event to set IDs
document.addEventListener('set-ids', (e: CustomEvent) => {
  aoiAppGlobals.setIds(e);
});

// Logging an activity
aoiAppGlobals.activity('Voting - left');
```