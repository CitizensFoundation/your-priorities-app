# AoiEarlIdeasEditor

The `AoiEarlIdeasEditor` class is a custom web component that extends `YpStreamingLlmBase`. It is designed to manage and edit ideas, including generating ideas with AI, submitting them for creation, and managing their status and associated icons.

## Properties

| Name                   | Type                              | Description                                                                 |
|------------------------|-----------------------------------|-----------------------------------------------------------------------------|
| groupId                | number                            | The ID of the group associated with the editor.                             |
| communityId            | number \| undefined               | The ID of the community associated with the editor.                         |
| openForAnswers         | boolean                           | Indicates if the editor is open for receiving answers.                      |
| domainId               | number \| undefined               | The ID of the domain associated with the editor.                            |
| configuration          | AoiConfigurationData              | The configuration data for the editor.                                      |
| isCreatingIdeas        | boolean                           | Indicates if ideas are currently being created.                             |
| choices                | AoiChoiceData[] \| undefined      | The list of choices available in the editor.                                |
| isGeneratingWithAi     | boolean                           | Indicates if ideas are being generated with AI.                             |
| isSubmittingIdeas      | boolean                           | Indicates if ideas are being submitted for creation.                        |
| isTogglingIdeaActive   | number \| undefined               | The ID of the idea currently being toggled for active status.               |
| isFetchingChoices      | boolean                           | Indicates if choices are currently being fetched.                           |
| group                  | YpGroupData                       | The group data associated with the editor.                                  |
| aiStyleInputElement    | MdOutlinedTextField \| undefined  | The input element for AI style configuration.                               |
| currentIdeasFilter     | "latest" \| "highestScore" \| "activeDeactive" | The current filter applied to the ideas.                                    |
| answersElement         | MdFilledTextField                 | The text field element for answers.                                         |
| scrollElementSelector  | string                            | The selector for the element to scroll.                                     |
| serverApi              | AoiAdminServerApi                 | The server API instance for interacting with the backend.                   |
| imageGenerator         | AoiGenerateAiLogos                | The image generator instance for creating AI logos.                         |
| shouldContinueGenerating | boolean                         | Indicates if the generation of AI icons should continue.                    |
| currentGeneratingIndex | number \| undefined               | The index of the current choice being processed for icon generation.        |

## Methods

| Name                      | Parameters                                                                 | Return Type | Description                                                                 |
|---------------------------|----------------------------------------------------------------------------|-------------|-----------------------------------------------------------------------------|
| connectedCallback         | None                                                                       | void        | Lifecycle method called when the component is added to the document.        |
| disconnectedCallback      | None                                                                       | void        | Lifecycle method called when the component is removed from the document.    |
| themeUpdated              | event: CustomEvent                                                         | void        | Updates the theme based on the event details.                               |
| socketClosed              | None                                                                       | void        | Handles the socket closed event.                                            |
| socketError               | None                                                                       | void        | Handles the socket error event.                                             |
| getChoices                | None                                                                       | Promise<void> | Fetches the choices from the server API.                                    |
| createGroupObserver       | None                                                                       | void        | Creates a proxy observer for the group data.                                |
| handleGroupChange         | None                                                                       | void        | Handles changes to the group data.                                          |
| addChatBotElement         | wsMessage: YpAssistantMessage                                              | Promise<void> | Adds a chat bot element based on the websocket message.                     |
| answers                   | None                                                                       | string[]    | Retrieves the current answers from the answers element.                     |
| hasMoreThanOneIdea        | None                                                                       | void        | Placeholder method to check if there is more than one idea.                 |
| openMenuFor               | answer: AoiChoiceData                                                      | void        | Opens a menu for the specified answer.                                      |
| generateIdeas             | None                                                                       | void        | Initiates the generation of ideas using AI.                                 |
| submitIdeasForCreation    | None                                                                       | Promise<void> | Submits the current ideas for creation.                                     |
| toggleIdeaActivity        | answer: AoiChoiceData                                                      | Function    | Returns a function to toggle the active status of an idea.                  |
| applyFilter               | filterType: string                                                         | void        | Applies a filter to the list of ideas.                                      |
| sortedChoices             | None                                                                       | AoiChoiceData[] \| undefined | Retrieves the sorted list of choices based on the current filter.            |
| updated                   | changedProperties: Map<string \| number \| symbol, unknown>                | void        | Lifecycle method called when properties are updated.                        |
| generateAiIcons           | None                                                                       | Promise<void> | Generates AI icons for the choices.                                         |
| generateAiIconsOld        | None                                                                       | Promise<void> | Legacy method for generating AI icons.                                      |
| stopGenerating            | None                                                                       | void        | Stops the generation of AI icons.                                           |
| allChoicesHaveIcons       | None                                                                       | boolean     | Checks if all choices have associated icons.                                |
| deleteImageUrl            | choice: AoiChoiceData                                                      | Promise<void> | Deletes the image URL for a choice.                                         |
| styles                    | None                                                                       | CSSResult[] | Returns the styles for the component.                                       |
| answersChanged            | None                                                                       | void        | Handles changes to the answers input.                                       |
| renderCreateIdeas         | None                                                                       | TemplateResult | Renders the UI for creating ideas.                                          |
| renderIdeasSortingChips   | None                                                                       | TemplateResult | Renders the sorting chips for ideas.                                        |
| renderIcon                | choice: AoiChoiceData                                                      | TemplateResult | Renders the icon for a choice.                                              |
| aiStyleChanged            | None                                                                       | void        | Handles changes to the AI style input.                                      |
| renderAnswerData          | answer: AoiChoiceData                                                      | TemplateResult | Renders the data for an answer.                                             |
| renderEditIdeas           | None                                                                       | TemplateResult | Renders the UI for editing ideas.                                           |
| render                    | None                                                                       | TemplateResult | Renders the component.                                                      |

## Events

- **yp-ws-closed**: Emitted when the websocket connection is closed.
- **yp-ws-error**: Emitted when there is an error with the websocket connection.
- **configuration-changed**: Emitted when the configuration is changed.
- **theme-config-changed**: Emitted when the theme configuration is changed.

## Examples

```typescript
// Example usage of the AoiEarlIdeasEditor web component
import './aoi-earl-ideas-editor.js';

const editor = document.createElement('aoi-earl-ideas-editor');
editor.groupId = 1;
editor.communityId = 2;
editor.domainId = 3;
editor.configuration = { /* configuration data */ };
document.body.appendChild(editor);
```