# AoiSurveyIntro

A custom element that provides an introduction to a survey, including a welcome message, admin buttons for analytics and settings, and a start button for voting. It is part of a larger application and interacts with global application state and services.

## Properties

| Name       | Type              | Description                                           |
|------------|-------------------|-------------------------------------------------------|
| earl       | AoiEarlData       | Data related to the EARL (survey) being introduced.   |
| group      | YpGroupData       | Data about the group associated with the survey.      |
| question   | AoiQuestionData   | Data about the current question in the survey.        |
| isAdmin    | boolean           | Indicates whether the current user is an admin.       |

## Methods

| Name                   | Parameters | Return Type | Description                                                                 |
|------------------------|------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback      |            | void        | Lifecycle method that runs when the element is added to the document's DOM. |
| disconnectedCallback   |            | void        | Lifecycle method that runs when the element is removed from the DOM.        |
| firstUpdated           |            | void        | Lifecycle method that runs after the element's first render.                |
| _openAnalyticsAndPromption |      | void        | Redirects to the analytics page for the group.                              |
| _openAdmin             |            | void        | Redirects to the admin page for the group.                                  |
| renderAdminButtons     |            | TemplateResult | Renders admin buttons for analytics and settings if the user is an admin. |
| setupFooterObserver    |            | void        | Sets up observers for the footer elements to track their visibility.        |
| clickStart             |            | void        | Handles the click event on the start voting button.                         |
| clickResults           |            | void        | Handles the click event on the open results button.                         |

## Events

- **startVoting**: Emitted when the start voting button is clicked.
- **openResults**: Emitted when the open results button is clicked.

## Examples

```typescript
// Example usage of the AoiSurveyIntro custom element
<aoi-survey-intro
  .earl=${earlData}
  .group=${groupData}
  .question=${questionData}
  .isAdmin=${true}
></aoi-survey-intro>
```

Note: The types `AoiEarlData`, `YpGroupData`, and `AoiQuestionData` are assumed to be defined elsewhere in the application and are not detailed in this documentation. The `TemplateResult` type refers to the result of rendering a Lit template.