# AoiNewIdeaDialog

The `AoiNewIdeaDialog` class is a custom web component that extends `YpGenerateAiImage`. It provides a dialog interface for users to submit new ideas, which can be processed and potentially flagged for review. The component also supports AI-generated icons for the submitted ideas.

## Properties

| Name           | Type                  | Description                                                                 |
|----------------|-----------------------|-----------------------------------------------------------------------------|
| earl           | AoiEarlData           | The data related to the earl configuration.                                 |
| groupId        | number                | The ID of the group associated with the idea.                               |
| question       | AoiQuestionData       | The question data related to the idea submission.                           |
| choice         | AoiChoiceData \| undefined | The choice data for the submitted idea, if available.                       |
| group          | YpGroupData           | The group data associated with the idea submission.                         |
| haveAddedIdea  | boolean               | Indicates whether an idea has been successfully added.                      |
| ideaText       | HTMLInputElement      | The input element for the idea text.                                        |
| dialog         | MdDialog              | The dialog element used for displaying the idea submission interface.       |
| serverApi      | AoiAdminServerApi     | The server API instance for handling idea submissions.                      |
| imageGenerator | AoiGenerateAiLogos    | The AI image generator instance for creating icons for ideas.               |

## Methods

| Name                | Parameters | Return Type | Description                                                                 |
|---------------------|------------|-------------|-----------------------------------------------------------------------------|
| constructor         |            |             | Initializes the component and sets up the server API instance.              |
| connectedCallback   |            | Promise<void> | Lifecycle method called when the component is added to the DOM.             |
| disconnectedCallback|            | void        | Lifecycle method called when the component is removed from the DOM.         |
| submitIdea          |            | Promise<void> | Submits the idea to the server and handles the response.                    |
| scrollUp            |            | void        | Scrolls the dialog content to the top.                                      |
| open                |            | Promise<void> | Opens the dialog for idea submission.                                       |
| cancel              |            | void        | Cancels the idea submission and closes the dialog.                          |
| reset               |            | void        | Resets the component state for a new idea submission.                       |
| close               |            | void        | Closes the dialog.                                                          |
| textAreaKeyDownIdea | e: any     | boolean     | Handles keydown events in the idea text area to prevent new lines.          |
| generateAiIcon      |            | Promise<void> | Generates an AI icon for the submitted idea.                                |
| regenerateIcon      |            | void        | Regenerates the AI icon for the current choice.                             |
| renderAnswer        |            | TemplateResult | Renders the answer section with the AI-generated icon.                      |
| renderIcon          |            | TemplateResult | Renders the icon or a loading spinner based on the generation state.        |
| renderContent       |            | TemplateResult | Renders the main content of the dialog, including the idea input field.     |
| renderFooter        |            | TemplateResult | Renders the footer of the dialog with action buttons.                       |
| render              |            | TemplateResult | Renders the entire dialog component.                                        |

## Examples

```typescript
// Example usage of the AoiNewIdeaDialog web component
import './path/to/aoi-new-idea-dialog.js';

const dialog = document.createElement('aoi-new-idea-dialog');
document.body.appendChild(dialog);
dialog.open();
```