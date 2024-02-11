# YpAppGlobals

The `YpAppGlobals` class is responsible for managing global application state and configurations. It handles various tasks such as user session management, application bootstrapping, language settings, and activity tracking.

## Properties

| Name                            | Type                                      | Description                                                                 |
|---------------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| seenWelcome                     | boolean                                   | Indicates if the welcome message has been seen.                             |
| resetSeenWelcome                | boolean                                   | Flag to reset the seen welcome status.                                      |
| disableWelcome                  | boolean                                   | Flag to disable the welcome message.                                        |
| activityHost                    | string                                    | Hostname for activity tracking.                                             |
| domain                          | YpDomainData \| undefined                 | Domain data for the application.                                            |
| groupConfigOverrides            | Record<number, Record<string, string \| boolean>> | Overrides for group configurations.                                         |
| currentAnonymousUser            | YpUserData \| undefined                   | Data for the current anonymous user.                                        |
| currentGroup                    | YpGroupData \| undefined                  | Data for the current group.                                                 |
| registrationQuestionsGroup      | YpGroupData \| undefined                  | Group data containing registration questions.                               |
| currentAnonymousGroup           | YpGroupData \| undefined                  | Data for the current anonymous group.                                       |
| currentForceSaml                | boolean                                   | Flag to force SAML authentication.                                          |
| disableFacebookLoginForGroup    | boolean                                   | Flag to disable Facebook login for a group.                                 |
| googleMapsApiKey                | string \| undefined                       | API key for Google Maps.                                                    |
| hasLlm                          | boolean                                   | Indicates if LLM (Local Lawmaking) is enabled.                              |
| currentSamlDeniedMessage        | string \| undefined                       | Message to display when SAML authentication is denied.                      |
| currentSamlLoginMessage         | string \| undefined                       | Message to display for SAML login.                                          |
| originalQueryParameters         | Record<string, string \| number \| undefined> | Original query parameters from the URL.                                     |
| externalGoalTriggerGroupId      | number \| undefined                       | Group ID for external goal triggers.                                        |
| externalGoalCounter             | number                                    | Counter for external goal triggers.                                         |
| appStartTime                    | Date                                      | Timestamp when the application started.                                     |
| autoTranslate                   | boolean                                   | Flag to enable automatic translation.                                       |
| goalTriggerEvents               | Array<string>                             | List of events that can trigger goals.                                      |
| haveLoadedLanguages             | boolean                                   | Indicates if languages have been loaded.                                    |
| hasTranscriptSupport            | boolean                                   | Indicates if transcript support is available.                               |
| hasVideoUpload                  | boolean                                   | Indicates if video upload is supported.                                     |
| hasAudioUpload                  | boolean                                   | Indicates if audio upload is supported.                                     |
| locale                          | string \| undefined                       | Selected locale.                                                            |
| i18nTranslation                 | any \| undefined                          | Translation object from i18next.                                            |
| serverApi                       | YpServerApi                               | API for server interactions.                                                |
| recommendations                 | YpRecommendations                         | Recommendations manager.                                                    |
| cache                           | YpCache                                   | Cache manager.                                                              |
| offline                         | YpOffline                                 | Offline manager.                                                            |
| analytics                       | YpAnalytics                               | Analytics manager.                                                          |
| theme                           | YpThemeManager                            | Theme manager.                                                              |
| highlightedLanguages            | string \| undefined                       | Highlighted languages for the application.                                  |
| magicTextIronResizeDebouncer    | number \| undefined                       | Debouncer for iron resize events.                                           |
| signupTermsPageId               | number \| undefined                       | Page ID for signup terms.                                                   |
| retryMethodAfter401Login        | Function \| undefined                     | Method to retry after a 401 login error.                                    |
| groupLoadNewPost                | boolean                                   | Flag to load new posts for a group.                                         |

## Methods

| Name                             | Parameters                        | Return Type | Description                                                                 |
|----------------------------------|-----------------------------------|-------------|-----------------------------------------------------------------------------|
| showRecommendationInfoIfNeeded   |                                   | void        | Shows recommendation info if it hasn't been shown before.                   |
| showSpeechToTextInfoIfNeeded     |                                   | void        | Shows speech-to-text info if it hasn't been shown before and is supported.  |
| hasVideoUploadSupport            |                                   | Promise<void> | Checks if video upload is supported and updates the state.                 |
| sendVideoView                    | videoId: number \| string         | void        | Sends a video view event to the server.                                     |
| sendLongVideoView                | videoId: number \| string         | void        | Sends a long video view event to the server.                                |
| hasAudioUploadSupport            |                                   | Promise<void> | Checks if audio upload is supported and updates the state.                 |
| sendAudioListen                  | audioId: number \| string         | void        | Sends an audio listen event to the server.                                  |
| sendLongAudioListen              | audioId: number \| string         | void        | Sends a long audio listen event to the server.                              |
| changeLocaleIfNeededAfterWait    | locale: string, force: boolean    | void        | Changes the application locale if needed after a delay.                     |
| setHighlightedLanguages          | languages: string \| undefined    | void        | Sets the highlighted languages for the application.                         |
| changeLocaleIfNeeded             | locale: string, force: boolean    | void        | Changes the application locale if needed.                                   |
| parseQueryString                 |                                   | void        | Parses the query string from the URL and updates the state.                 |
| setAnonymousUser                 | user: YpUserData \| undefined     | void        | Sets the current anonymous user.                                            |
| setRegistrationQuestionGroup     | group: YpGroupData \| undefined   | void        | Sets the group containing registration questions.                           |
| setAnonymousGroupStatus          | group: YpGroupData \| undefined   | void        | Sets the status of the current anonymous group.                             |
| _domainChanged                   | domain: YpDomainData \| undefined | void        | Handles domain changes.                                                     |
| notifyUserViaToast               | text: string                      | void        | Notifies the user with a toast message.                                     |
| reBoot                           |                                   | void        | Reboots the application.                                                    |
| _userLoggedIn                    | event: CustomEvent                | void        | Handles user login events.                                                  |
| setupTranslationSystem           | loadPathPrefix: string            | void        | Sets up the translation system for the application.                         |
| startTranslation                 |                                   | void        | Starts the automatic translation process.                                   |
| stopTranslation                  |                                   | void        | Stops the automatic translation process.                                    |
| boot                             |                                   | Promise<void> | Boots the application by fetching initial data from the server.            |
| setupGroupConfigOverride         | groupId: number, configOverride: string | void        | Sets up configuration overrides for a specific group.                      |
| overrideGroupConfigIfNeeded      | groupId: number, configuration: YpGroupConfiguration | YpGroupConfiguration | Overrides group configuration if needed.                                   |
| postLoadGroupProcessing          | group: YpGroupData                | void        | Processes a group after it has been loaded.                                 |
| checkExternalGoalTrigger         | type: string                      | void        | Checks if an external goal should be triggered based on the event type.     |
| activity                         | type: string, object: object \| string \| undefined, context: string \| object \| number \| undefined, target: string \| object \| undefined | void        | Logs an activity event and sends it to the server.                          |
| setSeenWelcome                   |                                   | void        | Sets the seen welcome status to true.                                       |
| getSessionFromCookie             |                                   | string      | Retrieves the session ID from the cookie.                                   |

## Events (if any)

- **yp-notify-dialog**: Emitted to show a notification dialog with a message.
- **yp-open-toast**: Emitted to open a toast notification with a message.
- **yp-language-loaded**: Emitted when a language has been loaded.
- **yp-has-video-upload**: Emitted when video upload support is determined.
- **yp-has-audio-upload**: Emitted when audio upload support is determined.
- **yp-refresh-language-selection**: Emitted to refresh language selection.
- **yp-change-header**: Emitted to change the application header.
- **yp-boot-from-server**: Emitted after the application has booted from server data.
- **yp-auto-translate**: Emitted to toggle automatic translation.
- **yp-domain-changed**: Emitted when the domain has changed.

## Examples

```typescript
// Example usage of the YpAppGlobals class
const serverApi = new YpServerApi();
const appGlobals = new YpAppGlobals(serverApi);

// Boot the application
appGlobals.boot().then(() => {
  console.log('Application booted successfully');
});

// Change the locale if needed
appGlobals.changeLocaleIfNeeded('en-US', false);

// Log an activity event
appGlobals.activity('view', 'video', 123);
```