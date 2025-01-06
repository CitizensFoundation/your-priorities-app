# YpAppGlobals

The `YpAppGlobals` class is a global manager for application-wide settings and functionalities. It extends the `YpCodeBase` class and integrates various modules such as server API, recommendations, cache, analytics, theme management, and offline support. It handles user sessions, domain configurations, language settings, and activity tracking.

## Properties

| Name                          | Type                                                                 | Description                                                                 |
|-------------------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------|
| seenWelcome                   | boolean                                                              | Indicates if the welcome message has been seen.                             |
| resetSeenWelcome              | boolean                                                              | Indicates if the welcome message should be reset.                           |
| disableWelcome                | boolean                                                              | Indicates if the welcome message is disabled.                               |
| activityHost                  | string                                                               | Host for activity tracking.                                                 |
| domain                        | YpDomainData \| undefined                                            | Current domain data.                                                        |
| groupConfigOverrides          | Record<number, Record<string, string \| boolean>>                    | Overrides for group configurations.                                         |
| currentAnonymousUser          | YpUserData \| undefined                                              | Current anonymous user data.                                                |
| currentGroup                  | YpGroupData \| undefined                                             | Current group data.                                                         |
| registrationQuestionsGroup    | YpGroupData \| undefined                                             | Group data for registration questions.                                      |
| currentAnonymousGroup         | YpGroupData \| undefined                                             | Current anonymous group data.                                               |
| currentForceSaml              | boolean                                                              | Indicates if SAML is forced.                                                |
| disableFacebookLoginForGroup  | boolean                                                              | Indicates if Facebook login is disabled for the group.                      |
| googleMapsApiKey              | string \| undefined                                                  | Google Maps API key.                                                        |
| hasLlm                        | boolean                                                              | Indicates if LLM is available.                                              |
| currentSamlDeniedMessage      | string \| undefined                                                  | Message displayed when SAML login is denied.                                |
| currentSamlLoginMessage       | string \| undefined                                                  | Message displayed during SAML login.                                        |
| originalQueryParameters       | Record<string, string \| number \| undefined>                        | Original query parameters from the URL.                                     |
| externalGoalTriggerGroupId    | number \| undefined                                                  | Group ID for external goal triggers.                                        |
| externalGoalCounter           | number                                                               | Counter for external goal triggers.                                         |
| appStartTime                  | Date                                                                 | Application start time.                                                     |
| autoTranslate                 | boolean                                                              | Indicates if auto-translation is enabled.                                   |
| goalTriggerEvents             | Array<string>                                                        | List of events that trigger goals.                                          |
| haveLoadedLanguages           | boolean                                                              | Indicates if languages have been loaded.                                    |
| hasTranscriptSupport          | boolean                                                              | Indicates if transcript support is available.                               |
| currentClientMemoryUuid       | string \| undefined                                                  | UUID for the current client memory.                                         |
| hasVideoUpload                | boolean                                                              | Indicates if video upload is supported.                                     |
| hasAudioUpload                | boolean                                                              | Indicates if audio upload is supported.                                     |
| myDomains                     | Array<YpShortDomainList> \| undefined                                | List of domains associated with the user.                                   |
| locale                        | string \| undefined                                                  | Current locale.                                                             |
| i18nTranslation               | any \| undefined                                                     | i18n translation instance.                                                  |
| serverApi                     | YpServerApi                                                          | Instance of the server API.                                                 |
| recommendations               | YpRecommendations                                                    | Instance of the recommendations module.                                     |
| cache                         | YpCache                                                              | Instance of the cache module.                                               |
| offline                       | YpOffline                                                            | Instance of the offline module.                                             |
| analytics                     | YpAnalytics                                                          | Instance of the analytics module.                                           |
| theme                         | YpThemeManager                                                       | Instance of the theme manager.                                              |
| highlightedLanguages          | string \| undefined                                                  | Highlighted languages.                                                      |
| magicTextIronResizeDebouncer  | number \| undefined                                                  | Debouncer for magic text iron resize.                                       |
| signupTermsPageId             | number \| undefined                                                  | Page ID for signup terms.                                                   |
| retryMethodAfter401Login      | Function \| undefined                                                | Method to retry after a 401 login error.                                    |
| groupLoadNewPost              | boolean                                                              | Indicates if a new post should be loaded for the group.                     |
| groupNeedsRefresh             | boolean                                                              | Indicates if the group needs a refresh.                                     |
| communityNeedsRefresh         | boolean                                                              | Indicates if the community needs a refresh.                                 |
| domainNeedsRefresh            | boolean                                                              | Indicates if the domain needs a refresh.                                    |
| defaultTheme                  | { variant: MaterialDynamicVariants, neutralColor: string, primaryColor: string, tertiaryColor: string, oneColorScheme: MaterialColorScheme, secondaryColor: string, neutralVariantColor: string, useLowestContainerSurface: boolean } | Default theme settings. |

## Methods

| Name                               | Parameters                                                                 | Return Type | Description                                                                 |
|------------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| constructor                        | serverApi: YpServerApi, disableInit: boolean                               | void        | Initializes the YpAppGlobals instance.                                      |
| setupMyDomains                     |                                                                            | Promise<void> | Sets up the user's domains.                                                 |
| showRecommendationInfoIfNeeded     |                                                                            | void        | Shows recommendation info if needed.                                        |
| showSpeechToTextInfoIfNeeded       |                                                                            | void        | Shows speech-to-text info if needed.                                        |
| hasVideoUploadSupport              |                                                                            | Promise<void> | Checks if video upload support is available.                                |
| sendVideoView                      | videoId: number \| string                                                  | void        | Sends a video view event.                                                   |
| sendLongVideoView                  | videoId: number \| string                                                  | void        | Sends a long video view event.                                              |
| hasAudioUploadSupport              |                                                                            | Promise<void> | Checks if audio upload support is available.                                |
| sendAudioListen                    | audioId: number \| string                                                  | void        | Sends an audio listen event.                                                |
| sendLongAudioListen                | audioId: number \| string                                                  | void        | Sends a long audio listen event.                                            |
| changeLocaleIfNeededAfterWait      | locale: string, force: boolean                                             | void        | Changes the locale if needed after a wait.                                  |
| setHighlightedLanguages            | languages: string \| undefined                                             | void        | Sets the highlighted languages.                                             |
| changeLocaleIfNeeded               | locale: string, force: boolean                                             | void        | Changes the locale if needed.                                               |
| parseQueryString                   |                                                                            | void        | Parses the query string from the URL.                                       |
| setAnonymousUser                   | user: YpUserData \| undefined                                              | void        | Sets the current anonymous user.                                            |
| setRegistrationQuestionGroup       | group: YpGroupData \| undefined                                            | void        | Sets the registration question group.                                       |
| setAnonymousGroupStatus            | group: YpGroupData \| undefined                                            | void        | Sets the status of the anonymous group.                                     |
| _domainChanged                     | domain: YpDomainData \| undefined                                          | void        | Handles domain changes.                                                     |
| notifyUserViaToast                 | text: string                                                               | void        | Notifies the user via a toast message.                                      |
| reBoot                             |                                                                            | void        | Reboots the application.                                                    |
| _userLoggedIn                      | event: CustomEvent                                                         | Promise<void> | Handles user login events.                                                  |
| setupTranslationSystem             | loadPathPrefix: string                                                     | void        | Sets up the translation system.                                             |
| startTranslation                   |                                                                            | void        | Starts the auto-translation feature.                                        |
| stopTranslation                    |                                                                            | void        | Stops the auto-translation feature.                                         |
| setCurrentDomain                   | domain: YpDomainData                                                       | void        | Sets the current domain.                                                    |
| boot                               |                                                                            | Promise<void> | Boots the application.                                                      |
| setupGroupConfigOverride           | groupId: number, configOverride: string                                    | void        | Sets up group configuration overrides.                                      |
| overrideGroupConfigIfNeeded        | groupId: number, configuration: YpGroupConfiguration                       | YpGroupConfiguration | Overrides group configuration if needed.                                    |
| postLoadGroupProcessing            | group: YpGroupData                                                         | void        | Processes group data after loading.                                         |
| checkExternalGoalTrigger           | type: string                                                               | void        | Checks for external goal triggers.                                          |
| activity                           | type: string, object: object \| string \| undefined, context: string \| object \| number \| undefined, target: string \| object \| undefined | void | Logs an activity event.                                                     |
| setSeenWelcome                     |                                                                            | void        | Sets the welcome message as seen.                                           |
| getSessionFromCookie               |                                                                            | string      | Retrieves the session ID from cookies.                                      |

## Events

- **app-ready**: Emitted when the application is ready.
- **yp-my-domains-loaded**: Emitted when the user's domains are loaded.
- **yp-notify-dialog**: Emitted to notify the user via a dialog.
- **yp-has-video-upload**: Emitted when video upload support is confirmed.
- **yp-has-audio-upload**: Emitted when audio upload support is confirmed.
- **yp-language-loaded**: Emitted when a language is loaded.
- **language-loaded**: Emitted when a language is loaded.
- **yp-refresh-language-selection**: Emitted to refresh language selection.
- **yp-domain-changed**: Emitted when the domain changes.
- **yp-open-toast**: Emitted to open a toast notification.
- **yp-boot-from-server**: Emitted when the application boots from the server.
- **yp-auto-translate**: Emitted when auto-translation is toggled.

## Examples

```typescript
// Example usage of the YpAppGlobals class
const serverApi = new YpServerApi();
const appGlobals = new YpAppGlobals(serverApi);

// Set the current domain
appGlobals.setCurrentDomain({ id: 1, domain_name: "example.com", description: "Example Domain" });

// Change locale if needed
appGlobals.changeLocaleIfNeeded("en", true);

// Log an activity
appGlobals.activity("view", "page", "home");
```