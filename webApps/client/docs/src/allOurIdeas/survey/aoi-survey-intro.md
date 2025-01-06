# AoiSurveyIntro

The `AoiSurveyIntro` class is a custom web component that extends `YpBaseElement`. It is designed to display an introduction to a survey, including group information, a welcome message, and options for administrators to access analytics and admin settings.

## Properties

| Name      | Type             | Description                                                                 |
|-----------|------------------|-----------------------------------------------------------------------------|
| earl      | AoiEarlData      | The data object containing configuration and state information for the survey. |
| group     | YpGroupData      | The data object representing the group associated with the survey.          |
| question  | AoiQuestionData  | The data object representing the current question in the survey.            |
| isAdmin   | boolean          | Indicates whether the current user has administrative privileges.           |

## Methods

| Name                        | Parameters | Return Type | Description                                                                 |
|-----------------------------|------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback           | None       | Promise<void> | Lifecycle method called when the element is added to the document. Initializes admin status and logs activity. |
| disconnectedCallback        | None       | void        | Lifecycle method called when the element is removed from the document. Cleans up observers and logs activity. |
| firstUpdated                | None       | void        | Lifecycle method called after the element's DOM has been updated for the first time. Sets up footer observers. |
| _openAnalyticsAndPromotions | None       | void        | Redirects the user to the analytics page for the current group.             |
| _openAdmin                  | None       | void        | Redirects the user to the admin page for the current group.                 |
| renderAdminButtons          | None       | TemplateResult | Renders the admin buttons for accessing analytics and admin settings.       |
| setupFooterObserver         | None       | void        | Sets up intersection observers for the footer elements to track visibility. |
| formattedDescription        | None       | string      | Returns the formatted welcome message with line breaks converted to `<br>`. |
| clickStart                  | None       | void        | Fires a "startVoting" event and logs the activity.                          |
| clickResults                | None       | void        | Fires an "openResults" event.                                               |

## Events

- **startVoting**: Emitted when the "Start Voting" button is clicked.
- **openResults**: Emitted when the "Open Results" button is clicked.

## Examples

```typescript
// Example usage of the aoi-survey-intro component
import './path/to/aoi-survey-intro.js';

const surveyIntro = document.createElement('aoi-survey-intro');
surveyIntro.earl = { /* AoiEarlData object */ };
surveyIntro.group = { /* YpGroupData object */ };
surveyIntro.question = { /* AoiQuestionData object */ };
document.body.appendChild(surveyIntro);
```