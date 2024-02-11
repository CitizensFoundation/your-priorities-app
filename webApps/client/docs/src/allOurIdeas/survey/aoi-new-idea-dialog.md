# AoiNewIdeaDialog

A custom element that provides a dialog for submitting new ideas within a group. It extends the `YpGenerateAiImage` class to allow for AI-generated iconography for the ideas.

## Properties

| Name            | Type                      | Description                                                                 |
|-----------------|---------------------------|-----------------------------------------------------------------------------|
| earl            | AoiEarlData               | The EARL data associated with the idea.                                     |
| groupId         | number                    | The ID of the group to which the idea is being submitted.                   |
| question        | AoiQuestionData           | The question data related to the idea.                                      |
| choice          | AoiChoiceData \| undefined | The choice data for the idea, if available.                                 |
| group           | YpGroupData               | The group data associated with the idea.                                    |
| haveAddedIdea   | boolean                   | A flag indicating whether an idea has been added.                           |
| ideaText        | HTMLInputElement          | A reference to the input element for the idea text.                         |
| dialog          | MdDialog                  | A reference to the dialog element.                                          |
| serverApi       | AoiAdminServerApi         | An instance of the AoiAdminServerApi for server interactions.               |
| imageGenerator  | AoiGenerateAiLogos        | An instance of AoiGenerateAiLogos for generating AI logos.                  |

## Methods

| Name                | Parameters | Return Type | Description                                                                 |
|---------------------|------------|-------------|-----------------------------------------------------------------------------|
| submitIdea          |            | Promise     | Submits the new idea to the server and handles the response.                |
| scrollUp            |            | void        | Scrolls the dialog content to the top.                                      |
| open                |            | void        | Opens the dialog.                                                           |
| cancel              |            | void        | Closes the dialog without submitting.                                       |
| reset               |            | void        | Resets the dialog state to its initial values.                              |
| close               |            | void        | Closes the dialog.                                                          |
| textAreaKeyDownIdea | e: any     | boolean     | Handles the key down event on the idea text area, preventing form submission on Enter key. |
| generateAiIcon      |            | Promise     | Generates an AI icon for the submitted idea.                                |
| regenerateIcon      |            | void        | Regenerates the AI icon for the idea.                                       |
| renderAnswer        |            | TemplateResult \| typeof nothing | Renders the answer part of the dialog. |
| renderIcon          |            | TemplateResult \| typeof nothing | Renders the icon associated with the idea. |
| renderContent       |            | TemplateResult | Renders the content of the dialog.                                          |
| renderFooter        |            | TemplateResult | Renders the footer of the dialog.                                           |

## Events

- **display-snackbar**: Emitted to display a snackbar message.

## Examples

```typescript
// Example usage of the AoiNewIdeaDialog
const dialog = document.createElement('aoi-new-idea-dialog');
dialog.earl = { /* ... */ };
dialog.groupId = 123;
dialog.question = { /* ... */ };
dialog.group = { /* ... */ };
document.body.appendChild(dialog);
dialog.open();
```

Please note that the actual implementation of the `AoiNewIdeaDialog` class may include additional methods, properties, and events not documented here, as this is a simplified representation for the purpose of API documentation.