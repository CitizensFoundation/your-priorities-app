# YpServerApi

The `YpServerApi` class extends `YpServerApiBase` and provides methods to interact with a server API. It includes methods for user authentication, content management, media handling, and more.

## Properties

No public properties are documented.

## Methods

| Name                               | Parameters                                      | Return Type | Description                                                                 |
|------------------------------------|-------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| boot                               |                                                 | Promise     | Fetches the domain information.                                             |
| isloggedin                         |                                                 | Promise     | Checks if the user is logged in.                                            |
| getAdminRights                     |                                                 | Promise     | Retrieves the admin rights of the logged-in user.                           |
| getMemberships                     |                                                 | Promise     | Gets the memberships of the logged-in user.                                 |
| getAdminRightsWithNames            |                                                 | Promise     | Fetches the admin rights with names for the logged-in user.                 |
| getMembershipsWithNames            |                                                 | Promise     | Retrieves the memberships with names for the logged-in user.                |
| logout                             |                                                 | Promise     | Logs out the current user.                                                  |
| setLocale                          | body: Record<string, unknown>                   | Promise     | Sets the locale for the logged-in user.                                     |
| getRecommendationsForGroup         | groupId: number                                 | Promise     | Gets post recommendations for a specific group.                             |
| hasVideoUploadSupport              |                                                 | Promise     | Checks if video upload is supported.                                        |
| hasAudioUploadSupport              |                                                 | Promise     | Checks if audio upload is supported.                                        |
| sendVideoView                      | body: Record<string, unknown>                   | Promise     | Sends a video view event.                                                   |
| sendAudioView                      | body: Record<string, unknown>                   | Promise     | Sends an audio view event.                                                  |
| createActivityFromApp              | body: Record<string, unknown>                   | Promise     | Creates an activity from the app.                                           |
| marketingTrackingOpen              | groupId: number, body: Record<string, unknown>  | Promise     | Tracks marketing activity for a group.                                      |
| createApiKey                       |                                                 | Promise     | Creates an API key for the user.                                            |
| triggerTrackingGoal                | groupId: number, body: Record<string, unknown>  | Promise     | Triggers a tracking goal for a group.                                       |
| startGeneratingAiImage             | collectionType: string, collectionId: number, prompt: string | Promise | Starts generating an AI image.                                              |
| getPromoterRights                  |                                                 | Promise     | Retrieves the promoter rights of the logged-in user.                        |
| pollForGeneratingAiImage           | collectionType: string, collectionId: number, jobId: number | Promise | Polls for the status of AI image generation.                                |
| getCollection                      | collectionType: string, collectionId: number    | Promise     | Fetches a collection by type and ID.                                        |
| getCategoriesCount                 | id: number, tabName: string \| undefined        | Promise     | Gets the count of categories for a group.                                   |
| getGroupPosts                      | searchUrl: string                               | Promise     | Retrieves posts for a group based on a search URL.                          |
| getPost                            | postId: number                                  | Promise     | Fetches a post by its ID.                                                   |
| getGroup                           | groupId: number                                 | Promise     | Retrieves a group by its ID.                                                |
| endorsePost                        | postId: number, method: string, body: Record<string, unknown> | Promise | Endorses a post.                                                            |
| getHasNonOpenPosts                 | groupId: number                                 | Promise     | Checks if a group has non-open posts.                                       |
| getHelpPages                       | collectionType: string, collectionId: number    | Promise     | Retrieves help pages for a collection.                                      |
| getTranslation                     | translateUrl: string                            | Promise     | Fetches a translation.                                                      |
| getTranslatedRegistrationQuestions | groupId: number, targetLanguage: string         | Promise     | Gets translated registration questions for a group.                         |
| sendRegistrationQuestions          | registrationAnswers: Array<Record<string, string>> | Promise   | Sends registration question answers.                                        |
| savePostTranscript                 | postId: number, body: Record<string, unknown>   | Promise     | Saves a transcript for a post.                                              |
| getPostTranscriptStatus            | groupId: number, tabName: string \| undefined   | Promise     | Retrieves the transcript status for a post.                                 |
| addPoint                           | groupId: number, body: Record<string, unknown>  | Promise     | Adds a point to a group.                                                    |
| completeMediaPoint                 | mediaType: string, pointId: number, body: Record<string, unknown> | Promise | Completes a media point and adds it to a point.                             |
| completeMediaPost                  | mediaType: string, method: string, postId: number, body: Record<string, unknown> | Promise | Completes a media post and adds it to a post.                               |
| getPoints                          | postId: number                                  | Promise     | Retrieves points for a post.                                                |
| getMorePoints                      | postId: number, offsetUp: number, offsetDown: number | Promise | Fetches more points for a post with offsets.                                |
| getNewPoints                       | postId: number, latestPointCreatedAt: Date      | Promise     | Gets new points for a post based on the latest creation date.               |
| getSurveyTranslations              | post: YpPostData, language: string              | Promise     | Fetches survey translations for a post.                                     |
| getSurveyQuestionsTranslations     | group: YpGroupData, language: string            | Promise     | Retrieves survey question translations for a group.                         |
| getVideoFormatsAndImages           | videoId: number                                 | Promise     | Gets video formats and images for a video.                                  |
| getGroupConfiguration              | groupId: number                                 | Promise     | Retrieves the configuration for a group.                                    |
| setVideoCover                      | videoId: number, body: Record<string, unknown>  | Promise     | Sets the cover for a video.                                                 |
| getTranscodingJobStatus            | mediaType: string, mediaId: number, jobId: string | Promise   | Retrieves the status of a transcoding job.                                  |
| startTranscoding                   | mediaType: string, mediaId: number, startType: string, body: Record<string, unknown> | Promise | Starts transcoding for media.                                               |
| createPresignUrl                   | mediaUrl: string, body: Record<string, unknown> | Promise     | Creates a presigned URL for media.                                          |
| updatePoint                        | pointId: number, body: Record<string, unknown>  | Promise     | Updates a point.                                                            |
| updatePointAdminComment            | groupId: number, pointId: number, body: Record<string, unknown> | Promise | Updates the admin comment for a point.                                      |
| deletePoint                        | pointId: number                                 | Promise     | Deletes a point.                                                            |
| checkPointTranscriptStatus         | type: string, pointId: number                   | Promise     | Checks the transcript status for a point.                                   |
| registerUser                       | body: Record<string, unknown>                   | Promise     | Registers a new user.                                                       |
| registerAnonymously                | body: Record<string, unknown>                   | Promise     | Registers a user anonymously.                                               |
| loginUser                          | body: Record<string, unknown>                   | Promise     | Logs in a user.                                                             |
| submitForm                         | url: string, method: string, headers: Record<string, string>, body: string | Promise | Submits a form.                                                             |
| getSurveyGroup                     | surveyGroupId: number                           | Promise     | Retrieves a survey group.                                                   |
| postSurvey                         | surveyGroupId: number, body: Record<string, unknown> | Promise | Posts a survey for a group.                                                 |
| deleteActivity                     | type: string, collectionId: number, activityId: number | Promise | Deletes an activity.                                                        |
| getAcActivities                    | url: string                                     | Promise     | Retrieves activities.                                                       |
| getRecommendations                 | typeName: string, typeId: number                | Promise     | Fetches recommendations.                                                    |
| setNotificationsAsViewed           | body: Record<string, unknown>                   | Promise     | Marks notifications as viewed.                                              |
| setNotificationsAllAsViewed        |                                                 | Promise     | Marks all notifications as viewed.                                          |
| getAcNotifications                 | url: string                                     | Promise     | Retrieves notifications.                                                    |
| getComments                        | type: string, pointId: number                   | Promise     | Fetches comments for a point.                                               |
| getCommentsCount                   | type: string, pointId: number                   | Promise     | Retrieves the count of comments for a point.                                |
| postComment                        | type: string, id: number, body: Record<string, unknown> | Promise | Posts a comment.                                                            |
| setPointQuality                    | pointId: number, method: string, body: Record<string, unknown> | Promise | Sets the quality of a point.                                                |
| postNewsStory                      | url: string, body: Record<string, unknown>      | Promise     | Posts a news story.                                                         |
| pointUrlPreview                    | urlParams: string                               | Promise     | Previews a URL for a point.                                                 |
| disconnectSamlLogin                |                                                 | Promise     | Disconnects SAML login for the current user.                                |
| disconnectFacebookLogin            |                                                 | Promise     | Disconnects Facebook login for the current user.                            |
| deleteUser                         |                                                 | Promise     | Deletes the current user.                                                   |
| anonymizeUser                      |                                                 | Promise     | Anonymizes the current user.                                                |
| resetPassword                      | token: string, body: Record<string, unknown>    | Promise     | Resets the password for a user.                                             |
| setEmail                           | body: Record<string, unknown>                   | Promise     | Sets the email for the current user.                                        |
| linkAccounts                       | body: Record<string, unknown>                   | Promise     | Links accounts for the current user.                                        |
| confirmEmailShown                  |                                                 | Promise     | Confirms that the email confirmation has been shown.                        |
| forgotPassword                     | body: Record<string, unknown>                   | Promise     | Initiates the forgot password process.                                      |
| acceptInvite                       | token: string                                   | Promise     | Accepts an invite.                                                          |
| getInviteSender                    | token: string                                   | Promise     | Retrieves the sender of an invite.                                          |
| getPostLocations                   | type: string, id: number                        | Promise     | Fetches post locations.                                                     |
| hasAutoTranslation                 |                                                 | Promise     | Checks if auto-translation is available.                                    |
| apiAction                          | url: string, method: string, body: Record<string, unknown> | Promise | Performs a generic API action.                                              |
| getImages                          | postId: number                                  | Promise     | Retrieves images for a post.                                                |
| postRating                         | postId: number, ratingIndex: number, body: Record<string, unknown> | Promise | Posts a rating for a post.                                                  |
| deleteRating                       | postId: number, ratingIndex: number             | Promise     | Deletes a rating for a post.                                                |

## Events

No events are documented.

## Examples

```typescript
// Example usage of logging in a user
const api = new YpServerApi();
api.loginUser({ email: 'user@example.com', password: 'password123' }).then(response => {
  // Handle the response
});
```

```typescript
// Example usage of fetching a group's configuration
const api = new YpServerApi();
api.getGroupConfiguration(123).then(configuration => {
  // Process the configuration
});
```

```typescript
// Example usage of posting a comment
const api = new YpServerApi();
api.postComment('post', 456, { text: 'Great post!' }).then(comment => {
  // Comment has been posted
});
```

Please note that the actual implementation of the `YpServerApi` class may require additional context, such as authentication tokens, headers, and proper handling of the returned Promises. The examples provided here are for illustrative purposes and may not be fully functional without the complete context.