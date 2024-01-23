# YpAppGlobals

This class serves as a global state manager for the application, handling various aspects such as user sessions, localization, configuration overrides, analytics, and more.

## Properties

| Name                             | Type                                      | Description                                                                 |
|----------------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| seenWelcome                      | boolean                                   | Indicates if the welcome message has been seen.                             |
| resetSeenWelcome                 | boolean                                   | Flag to reset the seen welcome status.                                      |
| disableWelcome                   | boolean                                   | Flag to disable the welcome message.                                        |
| activityHost                     | string                                    | Hostname for activity tracking.                                             |
| domain                           | YpDomainData \| undefined                 | Domain data for the current session.                                        |
| groupConfigOverrides             | Record<number, Record<string, string \| boolean>> | Overrides for group configurations.                                         |
| currentAnonymousUser             | YpUserData \| undefined                   | Data for the current anonymous user.                                        |
| currentGroup                     | YpGroupData \| undefined                  | Data for the current group.                                                 |
| registrationQuestionsGroup       | YpGroupData \| undefined                  | Group data containing registration questions.                               |
| currentAnonymousGroup            | YpGroupData \| undefined                  | Data for the current anonymous group.                                       |
| currentForceSaml                 | boolean                                   | Flag to force SAML authentication.                                          |
| disableFacebookLoginForGroup     | boolean                                   | Flag to disable Facebook login for the current group.                       |
| currentSamlDeniedMessage         | string \| undefined                       | Message to display when SAML authentication is denied.                      |
| currentSamlLoginMessage          | string \| undefined                       | Message to display for SAML login.                                          |
| originalQueryParameters          | Record<string, string \| number \| undefined> | Original query parameters from the URL.                                     |
| externalGoalTriggerGroupId       | number \| undefined                       | Group ID for external goal triggers.                                        |
| externalGoalCounter              | number                                    | Counter for external goal triggers.                                         |
| appStartTime                     | Date                                      | Timestamp when the app was started.                                         |
| autoTranslate                    | boolean                                   | Flag to enable automatic translation.                                       |
| goalTriggerEvents                | Array<string>                             | List of events that can trigger goals.                                      |
| haveLoadedLanguages              | boolean                                   | Flag indicating if languages have been loaded.                              |
| hasTranscriptSupport             | boolean                                   | Flag indicating if transcript support is available.                         |
| hasVideoUpload                   | boolean                                   | Flag indicating if video upload is supported.                               |
| hasAudioUpload                   | boolean                                   | Flag indicating if audio upload is supported.                               |
| locale                           | string \| undefined                       | Selected locale for the application.                                        |
| i18nTranslation                  | any \| undefined                          | Translation object for internationalization.                                |
| serverApi                        | YpServerApi                               | API for server interactions.                                                |
| recommendations                  | YpRecommendations                         | Recommendations manager.                                                    |
| cache                            | YpCache                                   | Cache manager.                                                              |
| offline                          | YpOffline                                 | Offline manager.                                                            |
| analytics                        | YpAnalytics                               | Analytics manager.                                                          |
| theme                            | YpThemeManager                            | Theme manager.                                                              |
| highlightedLanguages             | string \| undefined                       | Highlighted languages for the application.                                  |
| magicTextIronResizeDebouncer     | number \| undefined                       | Debouncer for resizing text areas.                                          |
| signupTermsPageId                | number \| undefined                       | Page ID for signup terms.                                                   |
| retryMethodAfter401Login         | Function \| undefined                     | Method to retry after a 401 login error.                                    |
| groupLoadNewPost                 | boolean                                   | Flag to load new posts for the group.                                       |

## Methods

| Name                             | Parameters                                | Return Type | Description                                                                 |
|----------------------------------|-------------------------------------------|-------------|-----------------------------------------------------------------------------|
| constructor                      | serverApi: YpServerApi, disableInit: boolean |             | Initializes the global state with optional disabling of the initialization. |
| showRecommendationInfoIfNeeded   |                                           |             | Shows recommendation info if it hasn't been shown before.                   |
| showSpeechToTextInfoIfNeeded     |                                           |             | Shows speech-to-text info if it hasn't been shown before and is supported.  |
| hasVideoUploadSupport            |                                           | Promise<void> | Checks and updates the state for video upload support.                      |
| sendVideoView                    | videoId: number \| string                 |             | Sends a video view event to the server.                                     |
| sendLongVideoView                | videoId: number \| string                 |             | Sends a long video view event to the server.                                |
| hasAudioUploadSupport            |                                           | Promise<void> | Checks and updates the state for audio upload support.                      |
| sendAudioListen                  | audioId: number \| string                 |             | Sends an audio listen event to the server.                                  |
| sendLongAudioListen              | audioId: number \| string                 |             | Sends a long audio listen event to the server.                              |
| changeLocaleIfNeededAfterWait    | locale: string, force: boolean            |             | Changes the application locale if needed after a delay.                     |
| setHighlightedLanguages          | languages: string \| undefined            |             | Sets the highlighted languages for the application.                         |
| changeLocaleIfNeeded             | locale: string, force: boolean            |             | Changes the application locale if needed.                                   |
| parseQueryString                 |                                           |             | Parses the query string from the URL and updates the state.                 |
| setAnonymousUser                 | user: YpUserData \| undefined             |             | Sets the current anonymous user.                                            |
| setRegistrationQuestionGroup     | group: YpGroupData \| undefined           |             | Sets the group containing registration questions.                           |
| setAnonymousGroupStatus          | group: YpGroupData \| undefined           |             | Sets the status of the current anonymous group.                             |
| _domainChanged                   | domain: YpDomainData \| undefined         |             | Handles changes to the domain state.                                        |
| notifyUserViaToast               | text: string                              |             | Notifies the user with a toast message.                                     |
| reBoot                           |                                           |             | Reboots the application state.                                              |
| _userLoggedIn                    | event: CustomEvent                        |             | Handles user login events.                                                  |
| setupTranslationSystem           | loadPathPrefix: string                    |             | Sets up the translation system for the application.                         |
| startTranslation                 |                                           |             | Starts the automatic translation process.                                   |
| stopTranslation                  |                                           |             | Stops the automatic translation process.                                    |
| boot                             |                                           | Promise<void> | Boots the application state.                                                |
| setupGroupConfigOverride         | groupId: number, configOverride: string   |             | Sets up configuration overrides for a specific group.                       |
| overrideGroupConfigIfNeeded      | groupId: number, configuration: YpGroupConfiguration | YpGroupConfiguration | Overrides group configuration if needed.                                    |
| postLoadGroupProcessing          | group: YpGroupData                        |             | Processes the group after loading.                                          |
| checkExternalGoalTrigger         | type: string                              |             | Checks and triggers external goals if conditions are met.                   |
| activity                         | type: string, object: object \| string \| undefined, context: string \| object \| number \| undefined, target: string \| object \| undefined |             | Logs activity and sends it to analytics and the server.                     |
| setSeenWelcome                   |                                           |             | Sets the seen welcome status to true.                                       |
| getSessionFromCookie             |                                           | string      | Retrieves the session ID from the cookie.                                   |

## Events (if any)

- **yp-logged-in**: Emitted when a user logs in.
- **yp-notify-dialog**: Emitted to show a notification dialog.
- **yp-has-video-upload**: Emitted when video upload support is determined.
- **yp-has-audio-upload**: Emitted when audio upload support is determined.
- **yp-language-loaded**: Emitted when a language is loaded.
- **yp-domain-changed**: Emitted when the domain changes.
- **yp-open-toast**: Emitted to open a toast notification.
- **yp-change-header**: Emitted to change the header.
- **yp-auto-translate**: Emitted when auto-translate is started or stopped.
- **yp-refresh-language-selection**: Emitted to refresh language selection.

## Examples

```typescript
// Example usage of the YpAppGlobals class
const serverApi = new YpServerApi();
const appGlobals = new YpAppGlobals(serverApi);

// Show recommendation info if needed
appGlobals.showRecommendationInfoIfNeeded();

// Change the application locale
appGlobals.changeLocaleIfNeeded('es', true);

// Set the highlighted languages
appGlobals.setHighlightedLanguages('en,es,fr');

// Notify the user with a toast
appGlobals.notifyUserViaToast('Welcome to the application!');

// Log an activity
appGlobals.activity('view', 'video', 123);
```