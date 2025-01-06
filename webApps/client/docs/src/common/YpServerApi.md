# YpServerApi

The `YpServerApi` class extends the `YpServerApiBase` class and provides a comprehensive set of methods to interact with a server API. It includes methods for user authentication, content management, media handling, and more.

## Properties

| Name         | Type   | Description               |
|--------------|--------|---------------------------|
| baseUrlPath  | string | Base URL path for API endpoints. |

## Methods

| Name                               | Parameters                                                                 | Return Type | Description                                                                 |
|------------------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| boot                               | -                                                                          | Promise<any> | Fetches domain information.                                                 |
| isloggedin                         | -                                                                          | Promise<any> | Checks if a user is logged in.                                              |
| getAdminRights                     | -                                                                          | Promise<any> | Retrieves admin rights of the logged-in user.                               |
| getMemberships                     | -                                                                          | Promise<any> | Retrieves memberships of the logged-in user.                                |
| getAdminRightsWithNames            | -                                                                          | Promise<any> | Retrieves admin rights with names.                                          |
| getMembershipsWithNames            | -                                                                          | Promise<any> | Retrieves memberships with names.                                           |
| logout                             | -                                                                          | Promise<any> | Logs out the current user.                                                  |
| setLocale                          | body: Record<string, unknown>                                              | Promise<any> | Sets the locale for the logged-in user.                                     |
| getRecommendationsForGroup         | groupId: number                                                            | Promise<any> | Fetches post recommendations for a group.                                   |
| hasVideoUploadSupport              | -                                                                          | Promise<any> | Checks if video upload is supported.                                        |
| hasAudioUploadSupport              | -                                                                          | Promise<any> | Checks if audio upload is supported.                                        |
| sendVideoView                      | body: Record<string, unknown>                                              | Promise<any> | Sends a video view event.                                                   |
| sendAudioView                      | body: Record<string, unknown>                                              | Promise<any> | Sends an audio view event.                                                  |
| createActivityFromApp              | body: Record<string, unknown>                                              | Promise<any> | Creates an activity from an app.                                            |
| marketingTrackingOpen              | groupId: number, body: Record<string, unknown>                             | Promise<any> | Opens marketing tracking for a group.                                       |
| createApiKey                       | -                                                                          | Promise<any> | Creates a new API key.                                                      |
| triggerTrackingGoal                | groupId: number, body: Record<string, unknown>                             | Promise<any> | Triggers a tracking goal for a group.                                       |
| startGeneratingAiImage             | collectionType: string, collectionId: number, imageType: string, prompt: string | Promise<any> | Starts generating an AI image.                                              |
| getPromoterRights                  | -                                                                          | Promise<any> | Retrieves promoter rights of the logged-in user.                            |
| pollForGeneratingAiImage           | collectionType: string, collectionId: number, jobId: number                | Promise<any> | Polls for the status of AI image generation.                                |
| getCollection                      | collectionType: string, collectionId: number                               | Promise<any> | Retrieves a collection by type and ID.                                      |
| getMyDomains                       | -                                                                          | Promise<Array<YpShortDomainList>> | Retrieves the domains associated with the current user.                     |
| getGroupFolder                     | groupId: number                                                            | Promise<any> | Retrieves the folder for a specific group.                                  |
| getCategoriesCount                 | id: number, tabName: string \| undefined                                   | Promise<any> | Retrieves the count of categories for a group.                              |
| getGroupPosts                      | searchUrl: string                                                          | Promise<any> | Retrieves posts for a group based on a search URL.                          |
| getPost                            | postId: number                                                             | Promise<any> | Retrieves a specific post by ID.                                            |
| getGroup                           | groupId: number                                                            | Promise<any> | Retrieves a specific group by ID.                                           |
| endorsePost                        | postId: number, method: string, body: Record<string, unknown>              | Promise<any> | Endorses a post with a specified method.                                    |
| getHasNonOpenPosts                 | groupId: number                                                            | Promise<any> | Checks if a group has non-open posts.                                       |
| getHelpPages                       | collectionType: string, collectionId: number                               | Promise<any> | Retrieves help pages for a collection.                                      |
| getTranslation                     | translateUrl: string                                                       | Promise<any> | Retrieves a translation from a specified URL.                               |
| getTranslatedRegistrationQuestions | groupId: number, targetLanguage: string                                    | Promise<Array<string>> | Retrieves translated registration questions for a group.                    |
| sendRegistrationQuestions          | registrationAnswers: Array<Record<string, string>>                         | Promise<any> | Sends registration questions.                                               |
| savePostTranscript                 | postId: number, body: Record<string, unknown>                              | Promise<any> | Saves a transcript for a post.                                              |
| getPostTranscriptStatus            | groupId: number, tabName: string \| undefined                              | Promise<any> | Retrieves the status of a post transcript.                                  |
| addPoint                           | groupId: number, body: Record<string, unknown>                             | Promise<any> | Adds a point to a group.                                                    |
| completeMediaPoint                 | mediaType: string, pointId: number, body: Record<string, unknown>          | Promise<any> | Completes a media point and adds it to a point.                             |
| completeMediaPost                  | mediaType: string, method: string, postId: number, body: Record<string, unknown> | Promise<any> | Completes a media post and adds it to a post.                               |
| getPoints                          | postId: number                                                             | Promise<any> | Retrieves points for a post.                                                |
| getMorePoints                      | postId: number, offsetUp: number, offsetDown: number                       | Promise<any> | Retrieves more points for a post with specified offsets.                    |
| getNewPoints                       | postId: number, latestPointCreatedAt: Date                                 | Promise<any> | Retrieves new points for a post since a specified date.                     |
| getSurveyTranslations              | post: YpPostData, language: string                                         | Promise<any> | Retrieves survey translations for a post.                                   |
| getSurveyQuestionsTranslations     | group: YpGroupData, language: string                                       | Promise<any> | Retrieves survey question translations for a group.                         |
| getVideoFormatsAndImages           | videoId: number                                                            | Promise<any> | Retrieves video formats and images for a video.                             |
| getGroupConfiguration              | groupId: number                                                            | Promise<any> | Retrieves configuration for a group.                                        |
| setVideoCover                      | videoId: number, body: Record<string, unknown>                             | Promise<any> | Sets the cover image for a video.                                           |
| getTranscodingJobStatus            | mediaType: string, mediaId: number, jobId: string                          | Promise<any> | Retrieves the status of a transcoding job.                                  |
| startTranscoding                   | mediaType: string, mediaId: number, startType: string, body: Record<string, unknown> | Promise<any> | Starts transcoding for a media item.                                        |
| createPresignUrl                   | mediaUrl: string, body: Record<string, unknown> = {}                       | Promise<any> | Creates a presigned URL for media upload.                                   |
| updatePoint                        | pointId: number, body: Record<string, unknown>                             | Promise<any> | Updates a point with new data.                                              |
| updatePointAdminComment            | groupId: number, pointId: number, body: Record<string, unknown>            | Promise<any> | Updates the admin comment for a point.                                      |
| deletePoint                        | pointId: number                                                            | Promise<any> | Deletes a point.                                                            |
| checkPointTranscriptStatus         | type: string, pointId: number                                              | Promise<any> | Checks the transcript status of a point.                                    |
| registerUser                       | body: Record<string, unknown>                                              | Promise<any> | Registers a new user.                                                       |
| registerAnonymously                | body: Record<string, unknown>                                              | Promise<any> | Registers a user anonymously.                                               |
| loginUser                          | body: Record<string, unknown>                                              | Promise<any> | Logs in a user.                                                             |
| getAoiTotalStats                   | domainId: number                                                           | Promise<AoiSiteStats> | Retrieves total stats for a domain.                                         |
| submitForm                         | url: string, method: string, headers: Record<string, string>, body: string | Promise<any> | Submits a form with specified parameters.                                   |
| getSurveyGroup                     | surveyGroupId: number                                                      | Promise<any> | Retrieves a survey group by ID.                                             |
| postSurvey                         | surveyGroupId: number, body: Record<string, unknown>                       | Promise<any> | Posts a survey for a group.                                                 |
| deleteActivity                     | type: string, collectionId: number, activityId: number                     | Promise<any> | Deletes an activity from a collection.                                      |
| getAcActivities                    | url: string                                                                | Promise<any> | Retrieves activities from a specified URL.                                  |
| getRecommendations                 | typeName: string, typeId: number                                           | Promise<any> | Retrieves recommendations for a type and ID.                                |
| setNotificationsAsViewed           | body: Record<string, unknown>                                              | Promise<any> | Marks notifications as viewed.                                              |
| setNotificationsAllAsViewed        | -                                                                          | Promise<any> | Marks all notifications as viewed.                                          |
| getAcNotifications                 | url: string                                                                | Promise<any> | Retrieves notifications from a specified URL.                               |
| getComments                        | type: string, pointId: number                                              | Promise<any> | Retrieves comments for a point.                                             |
| getCommentsCount                   | type: string, pointId: number                                              | Promise<any> | Retrieves the count of comments for a point.                                |
| postComment                        | type: string, id: number, body: Record<string, unknown>                    | Promise<any> | Posts a comment for a type and ID.                                          |
| setPointQuality                    | pointId: number, method: string, body: Record<string, unknown>             | Promise<any> | Sets the quality of a point.                                                |
| postNewsStory                      | url: string, body: Record<string, unknown>                                 | Promise<any> | Posts a news story to a specified URL.                                      |
| pointUrlPreview                    | urlParams: string                                                          | Promise<any> | Retrieves a preview for a point URL.                                        |
| disconnectSamlLogin                | -                                                                          | Promise<any> | Disconnects SAML login for the current user.                                |
| disconnectFacebookLogin            | -                                                                          | Promise<any> | Disconnects Facebook login for the current user.                            |
| deleteUser                         | -                                                                          | Promise<any> | Deletes the current user.                                                   |
| anonymizeUser                      | -                                                                          | Promise<any> | Anonymizes the current user.                                                |
| resetPassword                      | token: string, body: Record<string, unknown>                               | Promise<any> | Resets the password for a user with a token.                                |
| setEmail                           | body: Record<string, unknown>                                              | Promise<any> | Sets the email for a user.                                                  |
| linkAccounts                       | body: Record<string, unknown>                                              | Promise<any> | Links accounts for a user.                                                  |
| confirmEmailShown                  | -                                                                          | Promise<any> | Confirms that the email confirmation has been shown.                        |
| forgotPassword                     | body: Record<string, unknown>                                              | Promise<any> | Initiates a password reset process.                                         |
| acceptInvite                       | token: string                                                              | Promise<any> | Accepts an invite with a token.                                             |
| getInviteSender                    | token: string                                                              | Promise<any> | Retrieves the sender of an invite.                                          |
| getPostLocations                   | type: string, id: number                                                   | Promise<any> | Retrieves locations for a post.                                             |
| hasAutoTranslation                 | -                                                                          | Promise<any> | Checks if auto-translation is available.                                    |
| apiAction                          | url: string, method: string, body: Record<string, unknown>                 | Promise<any> | Performs a generic API action.                                              |
| getImages                          | postId: number                                                             | Promise<any> | Retrieves images for a post.                                                |
| postRating                         | postId: number, ratingIndex: number, body: Record<string, unknown>         | Promise<any> | Posts a rating for a post.                                                  |
| deleteRating                       | postId: number, ratingIndex: number                                        | Promise<any> | Deletes a rating for a post.                                                |

## Examples

```typescript
const api = new YpServerApi();
api.boot().then(domains => console.log(domains));
api.isloggedin().then(status => console.log(status));
api.getAdminRights().then(rights => console.log(rights));
```